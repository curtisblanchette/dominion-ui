import { Component, OnDestroy } from "@angular/core";
import { FlowService } from "../../../flow.service";
import { Router } from "@angular/router";
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { FormControl, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss'],
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnDestroy {

  public data: any;
  public form:any;
  public fields:Array<any> = [];

  constructor(
    private router: Router,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private dataServiceFactory: DefaultDataServiceFactory,
    private flowService: FlowService,
    private fb: FormBuilder
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory)
    this.data = this.router.getCurrentNavigation()!.extras.state;
    this.initForm();
  }

  // public ngOnInit(){
  //   console.log('Flow Text component init');
  // }

  public initForm(){
    if( this.data.template === 'call-type' ){
      const form = {
        call_type : new FormControl('', [Validators.required])
      };
      this.form = this.fb.group(form);
    } else if( this.data.template === 'web-lead' ){
      const form = {
        web_lead_options : new FormControl('', [Validators.required])
      };
      this.form = this.fb.group(form);
    }
  }

  public formSubmit(){
    if( this.form.valid ){
      console.log('all Good');
      alert('Valid')
    } else {
      alert('Invalid');
    }
  }

  public ngOnDestroy() {
    console.log('Flow Text component destroy');
  }

}