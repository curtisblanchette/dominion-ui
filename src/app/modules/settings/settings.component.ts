import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import * as fromApp from '../../store/app.reducer';
import * as appActions from '../../store/app.actions';

import { ISetting } from '../../store/app.effects';
import { FiizDropDownComponent } from '../../common/components/ui/dropdown';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DropdownItem } from '../../common/components/interfaces/dropdownitem.interface';
import { ModuleTypes } from '../../data/entity-metadata';

@UntilDestroy()
@Component({
  selector: 'app-system',
  templateUrl: './settings.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public settings$: Observable<ISetting[]>;
  public general$: Observable<any[]>;
  public appointment$: Observable<any[]>;
  public flow$: Observable<any[]>;
  public moduleTypes: any;
  public loading$: Observable<boolean>;
  public form: FormGroup;
  public timezones$: Observable<DropdownItem[]>;
  public leadSources$: Observable<DropdownItem[]>
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
    private fb: FormBuilder
  ) {
    // selecting all the settings so that we can build one big form
    this.store.select(fromApp.selectSettings).pipe(
      untilDestroyed(this)
    ).subscribe(settings => {
      this.buildForm(settings);
    });

    // selecting grouped settings to build html controls
    this.general$ = this.store.select(fromApp.selectSettingGroup('general'));
    this.appointment$ = this.store.select(fromApp.selectSettingGroup('appointment'));
    this.flow$ = this.store.select(fromApp.selectSettingGroup('flow'));
    this.leadSources$ = this.store.select(fromApp.selectLookupsByKey('leadSource'));
    this.loading$ = this.store.select(fromApp.loading);
    this.timezones$ = this.store.select(fromApp.selectTimezones);
    this.moduleTypes = ModuleTypes;
  }

  ngOnInit(): void {

  }

  public buildForm(settings: any) {

    const form: any = {};

    for(const setting of settings) {
      form[setting.id] = new FormGroup({
        id: new FormControl(setting.id),
        name: new FormControl(setting.name),
        group: new FormControl(setting.group),
        value: new FormControl(setting.value)
      });
      if(setting.unit) {
        form[setting.id].addControl('unit', new FormControl(setting.unit));
      }
    }

    this.form = this.fb.group(form);
    console.log(this.form);
  }

  public getSettingDisplayName(name: string) {
    if(name) {
      return name.split('_').map((t: any) => t[0].toUpperCase() + t.substring(1)).join(' ');
    }
    return '';
  }

  public save() {
    const payload = Object.values(this.form.value);
    this.store.dispatch(appActions.SaveSettingsAction({payload}));

  }

}
