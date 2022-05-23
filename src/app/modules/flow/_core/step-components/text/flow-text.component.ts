import { AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FlowService } from "../../../flow.service";
import { Router } from "@angular/router";
import { EntityCollectionComponentBase } from '../../../../../data/entity-collection.component.base';
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { FormGroup, FormControl, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'flow-text',
  templateUrl: './flow-text.component.html',
  styleUrls: ['../_base.scss', './flow-text.component.scss'],
})
export class FlowTextComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, AfterViewInit {

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

  public ngOnInit(){
    
  }

  public initForm(){
    if( this.data.template === 'call-type' ){
      const form = {
        call_type : new FormControl('', [Validators.required])
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
  }

  public ngAfterViewInit(){

  }

}
