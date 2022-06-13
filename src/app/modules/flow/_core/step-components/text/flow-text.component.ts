import { Component, Input } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import * as flowActions from '../../../store/flow.actions';
import { Store } from '@ngrx/store';
import { FlowState } from '../../../store/flow.reducer';

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

  constructor(
    private store: Store<FlowState>,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {

  }

  public ngOnInit(){
    if (this.data) {
      this.initForm();
    }
  }

  public initForm() {
    let form: any = {};
    if (this.data.template === 'call-type') {
      form = {
        call_type: new FormControl('', [Validators.required])
      };
    } else if (this.data.template === 'web-lead') {
      form = {
        web_lead_options: new FormControl('', [Validators.required])
      };
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

  }

  public get isValid() {
    return this.form.valid;
  }

}
