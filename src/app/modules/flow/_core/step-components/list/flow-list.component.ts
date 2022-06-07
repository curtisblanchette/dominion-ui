import { Component, Input, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy {

  @Input('data') data: any;

  constructor(
    public flowService: FlowService
  ) {
  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public EmitValues( value:any ){
    if( value ){
      this.flowService.addVariables( {existing_lead : 'yes', existing_lead_record: value });
    }
  }

}
