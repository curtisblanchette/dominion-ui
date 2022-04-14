import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Store } from "@ngrx/store";

import { User } from '../../../../modules/login/models/user';
import * as fromLogin from '../../../../modules/login/store/login.reducer';
import { ActivationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {

  public loggedUser!: User | null;

  public menus: { name: string, path: string; }[] = [
    {
      name : 'Dashboard',
      path : 'dashboard'
    },
    {
      name : 'Reports',
      path : 'reports'
    },
    {
      name : 'Data',
      path : 'data'
    },
    {
      name : 'Call Flow',
      path : 'flow/f'
    },
    {
      name : 'Settings',
      path : 'settings'
    }
  ];

  @ViewChild('activeUnderline', { static: false }) activeUnderline: ElementRef;
  @ViewChildren('link') links: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private store: Store<fromLogin.LoginState>,
    private renderer: Renderer2
  ) {
    this.store.select(fromLogin.selectLoginUser).subscribe((user) => {
      if( user ){
          this.loggedUser = user as User
      } else {
          this.loggedUser = null;
      }
    });
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter(r=>r instanceof ActivationEnd),
      delay(0) // DO NOT REMOVE
    ).subscribe(() => this.updateActiveUnderline());
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


  ngOnInit(): void {
  }
}
