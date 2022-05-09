import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public selected:string;
  
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  public modules:Array<any> = [
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
  ];

  constructor( private router : Router ) { }

  ngOnInit(): void {

  }

  public navigate( module:string ){
    this.selected = module;
    this.onSelect.next(module);
  }

}
