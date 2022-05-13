import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../login/models/user';
import * as fromLogin from '../../modules/login/store/login.reducer';
import * as loginActions from '../../modules/login/store/login.actions';
import { buttons } from './dashboard.buttons';
import { bigButtons } from './dashboard.animations';

export interface IDashboardButton {
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
  route?: string;
  roles?: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './dashboard.component.scss'],
  animations: [
    bigButtons
  ]
})
export class DashboardComponent implements OnInit {

  public user!: User;
  public quickStartMenu: IDashboardButton[] = [];
  public supportMenu: IDashboardButton[] = buttons.support.get();

  constructor(
    private store: Store<fromLogin.LoginState>
  ) {
    this.store.select(fromLogin.selectUser).subscribe((user: any) => {
      if (user) {
        this.user = user as User;
        this.quickStartMenu = buttons.user.get(user.roles);
      }
    });
  }

  ngOnInit(): void {
  }

  public doSomething(value: any) {
    console.log(`Emitted value received: ${value}`);
  }

  public logout() {
    this.store.dispatch(loginActions.LogoutAction());
  }

}
