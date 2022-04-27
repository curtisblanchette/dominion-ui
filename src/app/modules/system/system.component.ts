import { Component } from "@angular/core";
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromSystem from './store/system.reducer';
import { DropdownItem } from '../../common/components/ui/forms';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './system.component.scss']
})
export class SystemComponent {

  public workspaces$: Observable<DropdownItem[]>

  constructor(
    private store: Store<fromSystem.SystemState>
  ) {

    this.workspaces$ = this.store.select(fromSystem.selectWorkspaces);
  }
}
