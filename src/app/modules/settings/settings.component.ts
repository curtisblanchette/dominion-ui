import { Component } from "@angular/core";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Observable } from 'rxjs';
import { ModuleType } from '../flow';

@Component({
  selector: 'app-system',
  templateUrl: './settings.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './settings.component.scss']
})
export class SettingsComponent {

  public appointmentSettings$: Observable<any>;
  public generalSettings$: Observable<any>;
  public byKey$: Observable<any>;
  public moduleTypes: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
     this.appointmentSettings$ = this.store.select(fromApp.selectSettingGroup('appointment'));
     this.generalSettings$ = this.store.select(fromApp.selectSettingGroup('general'));
     this.byKey$ = this.store.select(fromApp.selectSettingByKey('timezone'));
     this.moduleTypes = ModuleType;
  }

  public getSettingDisplayName(name: string) {
      return name.split('_').map((t: any)=> t[0].toUpperCase() + t.substring(1)).join(' ');
  }
}
