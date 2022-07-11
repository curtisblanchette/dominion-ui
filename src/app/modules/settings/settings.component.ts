import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import * as fromApp from '../../store/app.reducer';
import * as AppAction from '../../store/app.actions';
import { INestedSetting } from "../../store/app.effects";

@Component({
  selector: 'app-system',
  templateUrl: './settings.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  public appointmentSettings$: Observable<any>;
  public generalSettings$: Observable<any>;
  public byKey$: Observable<any>;
  public moduleTypes: any;

  public generalForm: FormGroup;

  constructor(
    private store: Store<fromApp.AppState>,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
      this.appointmentSettings$ = this.store.select(fromApp.selectSettingGroup('appointment'));
      this.generalSettings$ = this.store.select(fromApp.selectSettingGroup('general'));
      this.byKey$ = this.store.select(fromApp.selectSettingByKey('timezone'));
      this.generalForm = this.fb.group({});
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {
    this.initForms();
  }

  public initForms(){
    this.generalSettings$.forEach(element => {
      Object.entries(element).map( (el:Array<any>) => {
        this.generalForm.addControl(el[0], new FormControl(el[1]['value'], Validators.required));  
      });
    });
  }

  public getSettingDisplayName(name: string) {
    return name.split('_').map((t: any)=> t[0].toUpperCase() + t.substring(1)).join(' ');
  }

  public updateData(){
    if( this.generalForm.valid ){
      const values = this.generalForm.value;
      this.generalSettings$.forEach(element => {
        Object.entries(element).map( (el:Array<any>) => {
          const updatedData:INestedSetting = { id : el[1]['id'], value : values[el[0]], unit : el[1]['unit']  };
          this.store.dispatch( AppAction.UpdateSettingsAction( {payload : updatedData, keys : ['general',el[0]]} ));
        });
      });
      this.toastr.success('', 'success');
    } else {
      this.toastr.error('', 'Form is Invalid');
    }
  }

}
