import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { menuAnimation, arrowAnimation } from './sidebar.animation';
import { sidebarRoutes } from '../../data.routing';
import { Router } from '@angular/router';
import { IDropDownMenuItem } from '../../../../common/components/ui/dropdown';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations : [ menuAnimation, arrowAnimation ]
})
export class SidebarComponent implements OnInit {

  public selected:string;

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  @ViewChildren('menuGroup') menuGroup: QueryList<ElementRef>;

  public menu:Array<any> = sidebarRoutes;
  public mobileMenu: Observable<IDropDownMenuItem[]> = of([]);

  constructor(
    private router: Router
  ) {

    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      this.router.navigate(['/data/list']);
    }
  }

  ngOnInit(): void {
    this.menu = this.menu.map((item) => {
      item.state = false;
      return item;
    });
    const menu:Array<IDropDownMenuItem> = [];
    this.menu.map((item) => {
      item.children.map((child:any) => {
        menu.push({
          id: child.label,
          label: child.label,
          emitterValue: child.path,
          icon: ''
        });
      });
    });
    this.mobileMenu = of(menu);
  }

  /**
   * This getter is used in place of RouterLinkActive
   * The aux edit routes are not children of the parent list
   * makes matching on path unusable.
   */
  get parseModuleFromPath(): { [key:string] : string } {
    let module:{ [key:string] : string } = {
      path : '',
      label : ''
    };

    let re = /(aux:\w+)/g;
    let str = this.router.routerState.snapshot.url;
    let match = str.match(re);
    if(match) {
      const path = match[0].split(':')[1];
      module['path'] = path;
      this.menu.map((menu) => {
        menu.children.map((child:any) => {
          if( child.path == path ){
            module['label'] = child.label;
          }
        })
      })
    }

    return module;
  }

  public toggleMenu( index:number ){
    const state = !this.menu[index].state
    this.menu.map( (item) => {
      item.state = false;
      return item;
    });
    if( state ){
      this.menu[index].state = state;
    }
  }

  public goTo(event:any){
    const item = {'path': event};
    this.onSelect.next(item);
  }

  public onClick(item:string) {
    this.selected = item;
    this.onSelect.next(item);
  }

}
