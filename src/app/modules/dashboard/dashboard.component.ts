import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User } from '../login/models/user';
import * as fromLogin from '../../modules/login/store/login.reducer';
import * as loginActions from '../../modules/login/store/login.actions';
import { buttons } from './dashboard.buttons';
import { bigButtons } from './dashboard.animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FlowService } from '../flow/flow.service';
import { Router } from '@angular/router';

export interface IDashboardButton {
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
  route?: string;
  roles?: string[];
}

@UntilDestroy()
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
    private store: Store<fromLogin.LoginState>,
    private flowService : FlowService,
    private router: Router
  ) {
    this.store.select(fromLogin.selectUser).pipe(untilDestroyed(this)).subscribe((user: any) => {
      if (user) {
        this.user = user as User;
        this.quickStartMenu = buttons.user.get(user.roles);
      }
    });
  }

  ngOnInit(): void {
  }

  public async emitValue(value: any) {
    if( ['inbound', 'outbound'].includes(value) ){
      if( this.flowService.builder.process.firstStepId == this.flowService.builder.process.currentStepId ){
        await this.flowService.start(true);
        this.router.navigate(['flow'], {state : {data : {'call_direction' : value}}}  );
      }
    }
  }

  public logout() {
    this.store.dispatch(loginActions.LogoutAction());
  }

}
