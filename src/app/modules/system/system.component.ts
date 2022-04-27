import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromSystem from './store/system.reducer';
import * as systemActions from './store/system.actions';
import { DropdownItem } from '../../common/components/ui/forms';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './system.component.scss']
})
export class SystemComponent {

  public workspaces$: Observable<DropdownItem[]>;
  public actingFor$: Observable<DropdownItem | undefined>;

  constructor(
    private store: Store<fromSystem.SystemState>
  ) {
    this.workspaces$ = this.store.select(fromSystem.selectWorkspaces);
    this.actingFor$ = this.store.select(fromSystem.selectActingFor);
  }

  onChange($event: any) {
    localStorage.setItem('actingFor', $event.target.value);
    this.store.dispatch(systemActions.SetActingForAction({id: $event.target.value}));
  }
}
