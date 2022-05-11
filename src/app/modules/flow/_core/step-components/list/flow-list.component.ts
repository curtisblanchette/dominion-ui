import { Component, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy {
  state: any;

  constructor( public flowService: FlowService ) {}

  public ngOnDestroy(): void {
    
  }

  public EmitValues( value:any ){
    console.log('Emitted Values ', value);
  }

}
