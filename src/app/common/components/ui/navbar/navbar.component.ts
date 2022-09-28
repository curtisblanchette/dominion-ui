import { AfterViewInit, Component, ElementRef, HostListener, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../../../../modules/login/models/user';
import { ActivationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import * as fromApp from '../../../../store/app.reducer';
import * as fromSystem from '../../../../modules/system/store/system.reducer';
import * as fromLogin from '../../../../modules/login/store/login.reducer';
import { Observable, of } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

const mobileThreshold = 1024;

export interface NavbarItem { name: string; path?: string; roles: string[], children?: any[], open?: boolean; }[]

@UntilDestroy()
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterViewInit {

  public loggedUser!: User | null;
  public actingFor$: Observable<any>;
  public _isMobile: boolean;

  public menu: NavbarItem[] = [
    {
      name: 'Dashboard',
      path: 'dashboard',
      roles: ['system', 'admin', 'owner', 'consultant', 'agent']
    },
    {
      name: 'Reports',
      roles: ['system', 'admin', 'owner', 'consultant', 'agent'],
      children: [
        {
          name: 'Total Pipeline',
          path: 'reports/total-pipeline',
          roles: ['system', 'admin', 'owner', 'consultant', 'agent'],
        },
        {
          name: 'Team',
          path: 'reports/team',
          roles: ['system', 'admin', 'owner', 'consultant', 'agent'],
        }
      ]
    },
    {
      name: 'Data',
      path: 'data',
      roles: ['system', 'admin', 'owner', 'consultant', 'agent']
    },
    {
      name: 'Call Flow',
      path: 'flow',
      roles: ['system', 'admin', 'owner', 'consultant', 'agent']
    },
    {
      name: 'Pending Outcome',
      path: 'no-outcome',
      roles: ['system', 'admin', 'owner', 'consultant', 'agent']
    },
    {
      name: 'Settings',
      path: 'settings',
      roles: ['system', 'admin', 'owner'],
    },
    {
      name: 'System',
      path: 'system',
      roles: ['system']
    }
  ];
  public menuOpen: boolean;

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.isMobile = window.innerWidth < mobileThreshold;
    this.menuOpen = false;
    if( !this.isMobile ){
      of('').pipe(delay(0)).subscribe(() => this.updateActiveUnderline())
    }
  }
  @HostListener('click', ['$event'])
  clickInside($event: any) {
    $event.stopPropagation();
  }

  @HostListener('document:click')
  clickOutside() {
    this.menu.map(x =>  x.open = false);
  }

  @ViewChild('activeUnderline', {static: false}) activeUnderline: ElementRef;
  @ViewChildren('link') links: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private store: Store<fromApp.AppState>,
    private renderer: Renderer2
  ) {
    this.actingFor$ = this.store.select(fromSystem.selectActingFor);
    this.store.select(fromLogin.selectUser).pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.loggedUser = user as User;
        // TODO will likely have to test for more than the first role
        this.menu = this.menu.filter(item => item.roles.includes(user.roles[0]));
      } else {
        this.loggedUser = null;
      }
    });
    this.isMobile = window.innerWidth < mobileThreshold;
  }

  set isMobile(value: boolean) {
    this._isMobile = value;
  }

  get isMobile() {
    return this._isMobile;
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(r => r instanceof ActivationEnd),
      delay(0) // DO NOT REMOVE -- similar to run outside angular zone or setTimeout
    ).pipe(untilDestroyed(this)).subscribe(() => this.updateActiveUnderline());
  }

  updateActiveUnderline() {
    const el = this.links.find(item => item.nativeElement.classList.contains('active'))?.nativeElement;

    if (el) {
      const link = {
        left: el?.offsetLeft || 0,
        width: el?.offsetWidth || 0
      }

      this.renderer.setStyle(this.activeUnderline.nativeElement, 'left', link.left + 'px');
      this.renderer.setStyle(this.activeUnderline.nativeElement, 'width', link.width + 'px');
    }
  }



}
