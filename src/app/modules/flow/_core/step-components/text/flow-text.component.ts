import { Component, Input } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as flowActions from '../../../store/flow.actions';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';
import { Observable, of } from 'rxjs';
import { DropdownItem } from '../../../../../common/components/interfaces/dropdownitem.interface';

@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent {

  @Input('data') data: any;
  public form: any;
  public fields: Array<any> = [];
  public callTypes$: Observable<DropdownItem[]>;

  constructor(
    private store: Store<FlowState>,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    this.callTypes$ = of([{id: 'inbound',label: 'Inbound'}, {id: 'outbound',label: 'Outbound'}]);
  }

  public ngOnInit(){
    if (this.data) {
      this.initForm();
    }
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
    }

    /** If there is no form, the step's validity should be true */
    this.store.dispatch(flowActions.SetValidityAction({payload: true}));

  }

  public get isValid() {
    return this.form.valid;
  }

}
