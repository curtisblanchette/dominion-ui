import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChildren, QueryList } from '@angular/core';
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
      label : 'Standard',
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
          label : 'Campaigns',
          path : 'campaign',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Lead Sources',
          path : 'leadSource',
          icon : 'fa fa-address-book '
        },
      ]
    },
    {
      label : 'Custom',
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
