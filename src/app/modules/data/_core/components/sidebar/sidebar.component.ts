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
      'label' : 'Modules',
      'childrens' : [
        {
          label : 'Leads',
          path : 'lead',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Contacts',
          path : 'Contact',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Deals',
          path : 'deals',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Events',
          path : 'events',
          icon : 'fa fa-address-book '
        },
        {
          label : 'Calls',
          path : 'calls',
          icon : 'fa fa-address-book '
        },
      ]
    },

    {
      'label' : 'Other Modules',
      'childrens' : [
        {
          label : 'Other',
          path : 'other',
          icon : 'fa fa-address-book '
        }
      ]
    },

  ];

  constructor( private router : Router, private render:Renderer2 ) { }

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

  public navigate( module:string ){
    this.selected = module;
    this.onSelect.next(module);
  }

}
