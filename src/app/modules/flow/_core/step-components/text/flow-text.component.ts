import { Component, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { Router } from '@angular/router';
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss']
})
export class FlowTextComponent extends EntityCollectionComponentBase {

  public data: any;
  public form: any;
  public fields: Array<any> = [];

  constructor(
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.data = {
        body: 'select any one call type',
        template: 'call-type',
        title: 'Select a call type'
      };
    if (this.data) {
      this.initForm();
    }

  }

  // public ngOnInit(){
  //   console.log('Flow Text component init');
  // }

  public initForm() {
    if (this.data.template === 'call-type') {
      const form = {
        call_type: new FormControl('', [Validators.required])
      };
      this.form = this.fb.group(form);
    } else if (this.data.template === 'web-lead') {
      const form = {
        web_lead_options: new FormControl('', [Validators.required])
      };
      this.form = this.fb.group(form);
    }

    this.form.valueChanges.subscribe((value: any) => {
      console.log(value);
      this.flowService.addVariables(value)
    });
  }

  public get isValid() {
    return this.form.valid;
  }

}
