import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FlowService } from '../../flow.service';
import { DominionType } from '../../../../common/models';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy {

  @Input('data') data: any;
  @Input('module') module: any;
  @Input('options') options: any;

  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();

  constructor(
    public flowService: FlowService
  ) {
  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public EmitValues( value: {module: string, record: DominionType } ) {
    this.values.next(value)
  }

  public create($event: Event) {
    this.onCreate.next(true);
  }

}
