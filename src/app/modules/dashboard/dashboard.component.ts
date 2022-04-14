import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromLogin from 'src/app/modules/login/store/login.reducer';
import * as loginActions from 'src/app/modules/login/store/login.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private store: Store<fromLogin.LoginState>
  ) { }

  ngOnInit(): void {
  }

  public logout(){
    this.store.dispatch(loginActions.LogoutAction());
  }

}
