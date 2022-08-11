import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import * as fromApp from '../../store/app.reducer';
import * as AppAction from '../../store/app.actions';
import { INestedSetting } from '../../store/app.effects';
import { DropdownItem } from '../../common/components/ui/forms/select';
import { Fields as LeadFields } from '../../common/models/lead.model';
import { FiizDropDownComponent } from '../../common/components/ui/dropdown';

@Component({
  selector: 'app-system',
  templateUrl: './settings.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public settings$: Observable<INestedSetting>;
  public appointmentSettings$: Observable<INestedSetting>;
  public generalSettings$: Observable<any>;
  public moduleTypes: any;
  public loading$: Observable<boolean>;
  public generalForm: FormGroup;
  public apptForm: FormGroup;
  public timezones$: Observable<DropdownItem>;
  public units$: Observable<DropdownItem[]> = of([
    {
      id: 'seconds',
      label: 'Seconds'
    },
    {
      id: 'minutes',
      label: 'Minutes'
    },
    {
      id: 'hours',
      label: 'Hours'
    }
  ]);

  @ViewChildren('searchDropdowns') searchDropdowns: QueryList<FiizDropDownComponent>;

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.settings$ = this.store.select(fromApp.selectSettings);
    this.appointmentSettings$ = this.store.select(fromApp.selectSettingGroup('appointment'));
    this.generalSettings$ = this.store.select(fromApp.selectSettingGroup('general'));

    this.generalForm = this.fb.group({});
    this.apptForm = this.fb.group({});
    this.loading$ = this.store.select(fromApp.loading);

    this.timezones$ = this.store.select(fromApp.selectTimezones);
  }

  ngOnInit(): void {
    this.initForms();
  }

  public initForms() {

    this.generalSettings$.forEach(element => {
      Object.entries(element).map((el: Array<any>) => {
        this.generalForm.addControl(el[0], new FormControl(el[1]['value'], Validators.required));
      });
    });


    this.appointmentSettings$.forEach(element => {
      Object.entries(element).map((el: Array<any>) => {
        const formName = `appointment[${el[1]['id']}][${[el[0]]}][value]`;
        const formName1 = `appointment[${el[1]['id']}][${[el[0]]}][unit]`;
        this.apptForm.addControl(formName, new FormControl(el[1]['value'], Validators.required));
        this.apptForm.addControl(formName1, new FormControl(el[1]['unit'], Validators.required));
      });
    });

  }

  public getSettingDisplayName(name: string) {
    return name.split('_').map((t: any) => t[0].toUpperCase() + t.substring(1)).join(' ');
  }

  public getDropdownObjects(data: any) {
    if (data && data.leadSource) {
      const dropdown = this.searchDropdowns.find(cmp => cmp.id === LeadFields.LEAD_SOURCE_ID);
      dropdown?.setTheValue(data.leadSource.name, data.leadSource.id);
    }
  }

  public updateData(type: string) {
    switch (type) {
      case 'general':
        if (this.generalForm.valid) {
          const values = this.generalForm.value;
          this.generalSettings$.forEach(element => {
            Object.entries(element).map((el: Array<any>) => {
              const updatedData: INestedSetting = {id: el[1]['id'], value: values[el[0]], unit: el[1]['unit']};
              this.store.dispatch(AppAction.UpdateSettingsAction({payload: updatedData, keys: ['general', el[0]]}));
            });
          });
        } else {
          this.toastr.error('', 'Form is Invalid');
        }
        break;

      case 'appointment':
        if (this.apptForm.valid) {
          const values = this.apptForm.value;
          this.appointmentSettings$.forEach(element => {
            Object.entries(element).map((el: Array<any>) => {
              const val = values[`appointment[${el[1]['id']}][${[el[0]]}][value]`];
              const unit = values[`appointment[${el[1]['id']}][${[el[0]]}][unit]`];
              const updatedData: INestedSetting = {id: el[1]['id'], value: Number(val) as any, unit: unit};
              this.store.dispatch(AppAction.UpdateSettingsAction({payload: updatedData, keys: ['appointment', el[0]]}));
            });
          });
        }
        break;

    }

  }

}
