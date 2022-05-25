import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { menuAnimation, arrowAnimation } from './sidebar.animation';
import { sidebarRoutes } from '../../data.routing';

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

  constructor() { }

  ngOnInit(): void {
    this.menu = this.menu.map((item) => {
      item.state = false;
      return item;
    });
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
