import { AfterViewInit, Component, Input } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as flowActions from '../../../store/flow.actions';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../../../../../common/components/interfaces/dropdownitem.interface';
import { FormInvalidError, ModuleType, OnSave } from '../../classes';


@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent implements OnSave, AfterViewInit {

  @Input('data') data: any;

  // @ViewChildren(FiizDataComponent) dataCmp: QueryList<FiizDataComponent>;

  public form: any;
  public callTypes$: Observable<DropdownItem[]>;
  public moduleTypes: any;

  constructor(
    private store: Store<FlowState>,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    this.callTypes$ = of([{id: 'inbound',label: 'Inbound'}, {id: 'outbound',label: 'Outbound'}]);
    this.moduleTypes = ModuleType;
  }

  public ngOnInit(){
    if (this.data) {
      this.initForm();
    }
  }

  ngAfterViewInit() {
    // console.log(this.dataCmp);
  }

  public initForm() {
    let form: any = {};

    switch(this.data.template) {
      case 'call-type': {

        form['call_type'] = new FormControl('', [Validators.required]);
      }
      break;
      case 'web-lead': {
        form['web_lead_options'] = new FormControl('', [Validators.required]);
      }
      break;
      case 'power-question': {

      }
      break;
      case 'relationship-building': {

      }
      break;
    }


    if(Object.keys(form).length) {
      this.form = this.fb.group(form);

      this.form.valueChanges.subscribe((value: any) => {
        this.flowService.addVariables(value);
      });

      this.form.statusChanges.subscribe((value: any) => {
        this.store.dispatch(flowActions.SetValidityAction({payload: value === 'VALID'}));
      });
    } else {
      /** If there is no form, the step's validity should be true */
      this.store.dispatch(flowActions.SetValidityAction({payload: true}));
    }


  }

  onSave() {
    if(this.form.valid) {
      return;
    }
    throw new FormInvalidError(this.form.name);
  }

  public get isValid() {
    return this.form.valid;
  }

}
