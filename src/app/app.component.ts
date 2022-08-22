import { Component } from '@angular/core';
import { User } from './modules/login/models/user';
import { Observable } from 'rxjs';
import * as fromLogin from './modules/login/store/login.reducer';
import { Store } from '@ngrx/store';
import { LoginState } from './modules/login/store/login.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'dominion-ui';
  public loggedUser$: Observable<User | null>;

  constructor(
    public store: Store<LoginState>
  ) {
    this.loggedUser$ = this.store.select(fromLogin.selectUser);
  }
}
