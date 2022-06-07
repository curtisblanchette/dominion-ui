import { Component, Input, OnDestroy } from '@angular/core';
import { FlowService } from '../../../flow.service';
import { DominionType } from '../../../../../common/models';

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

  public EmitValues( value: {module: string, record: DominionType } ) {
    this.flowService.setValidity(!!value.record);
    this.flowService.addVariables( { [value.module]: value.record?.id || null });
  }

}
