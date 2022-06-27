import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { menuAnimation, arrowAnimation } from './sidebar.animation';
import { sidebarRoutes } from '../../data.routing';
import { Router } from '@angular/router';

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
  }

  /**
   * This getter is used in place of RouterLinkActive
   * The aux edit routes are not children of the parent list
   * makes matching on path unusable.
   */
  get parseModuleFromPath(): string {
    let re = /(aux:\w+)/g;
    let str = this.router.routerState.snapshot.url;
    let match = str.match(re);
    if(match) {
      return match[0].split(':')[1];
    }
    return '';
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

  public onClick(item:string) {
    this.selected = item;
    this.onSelect.next(item);
  }

}
