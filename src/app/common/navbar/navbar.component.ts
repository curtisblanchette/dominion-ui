import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import { User } from '../../modules/login/models/user';
import * as fromRoot from '../../reducers.index';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public loggedUser!: User | null;

  public menus:Array<Object> = [
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
  ]

  constructor( 
    private store: Store<fromRoot.State> 
  ) { 
    this.store.select(fromRoot.getUser).subscribe((user) => {
      if( user ){
          this.loggedUser = user as User
      } else {
          this.loggedUser = null;
      }
    });
  }

  ngOnInit(): void {
  }

}
