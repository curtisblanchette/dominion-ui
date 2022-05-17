import { Component, OnInit, Output, EventEmitter, Renderer2, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { menuAnimation, arrowAnimation } from './sidebar.animation';

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

  public menu:Array<any> = [
    {
      label : 'Modules',
      children : [
        {
          label : 'Leads',
          path : 'lead',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Contacts',
          path : 'contact',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Deals',
          path : 'deal',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Events',
          path : 'event',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Calls',
          path : 'call',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Campaign',
          path : 'campaign',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Lead Source',
          path : 'leadSource',
          icon : 'fa fa-address-book '
        },
      ]
    },
    {
      label : 'Other Modules',
      children : [
        {
          label : 'Other',
          path : 'other',
          icon : 'fa fa-address-book '
        }
      ]
    },

  ];

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
