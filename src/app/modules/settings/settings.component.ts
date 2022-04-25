import { Component } from "@angular/core";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-system',
  templateUrl: './settings.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './settings.component.scss']
})
export class SettingsComponent {

  public settings$: Observable<any>;

  constructor(
    private store: Store<fromApp.AppState>
  ) {
     this.settings$ = this.store.select(fromApp.selectSettings);
  }
}
