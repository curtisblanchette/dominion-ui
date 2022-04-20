import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { User } from '../login/models/user';
import * as fromLogin from '../../modules/login/store/login.reducer';
import * as loginActions from '../../modules/login/store/login.actions';
import { buttons } from './buttons.definition';

export interface IDashboardButton {
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
  roles?: string[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './dashboard.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter',
        query('button', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          stagger(-30, [
            animate('350ms cubic-bezier(0.16, 0.14, 0.21, 0.61)', style({transform: 'translateX(0%)', opacity: 1}))
          ])
        ], {optional: true})
      )
    ]),
    trigger('slideInWithDelay', [
      transition(':enter',
        query('button', [
          style({transform: 'translateX(-100%)', opacity: 0}),
          stagger(-60, [
            animate('450ms cubic-bezier(0.3, -0.02, 0.14, 1.01)', style({transform: 'translateX(0%)', opacity: 1}))
          ])
        ], {optional: true})
      )
    ])
  ]
})
export class DashboardComponent implements OnInit {

  public loggedUser!: User;
  public quickStartMenu: IDashboardButton[] = [];
  public supportMenu: IDashboardButton[] = buttons.support.get();

  constructor(
    private store: Store<fromLogin.LoginState>
  ) {
    this.store.select(fromLogin.selectLoginUser).subscribe((user: any) => {
      if (user) {
        this.loggedUser = user as User;
        this.quickStartMenu = buttons.user.get(user.role);
      }
    });
  }

  ngOnInit(): void {
  }

  public doSomething(value: any) {
    console.log(`Emiited value received ${value}`);
  }

  public logout() {
    this.store.dispatch(loginActions.LogoutAction());
  }

}
