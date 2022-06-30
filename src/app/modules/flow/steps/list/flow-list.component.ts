import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FlowService } from '../../flow.service';
import { DominionType } from '../../../../common/models';
import { FlowState } from '../../store/flow.reducer';
import { Store } from '@ngrx/store';
import { firstValueFrom, take } from 'rxjs';
import * as fromFlow from '../../store/flow.reducer';
import { FiizListComponent } from '../../../../common/components/ui/list/list.component';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html' ,
  styleUrls: ['../_base.scss','./flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy, AfterContentInit, OnInit {

  @Input('data') data: any;
  @Input('module') module: any;
  @Input('options') options: any;

  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();

  @ViewChild(FiizListComponent, { static: true }) cmp: FiizListComponent;

  constructor(
    public store: Store<FlowState>,
    public flowService: FlowService
  ) {

  }

  public async ngAfterContentInit() {

    console.log('FlowListComponent AfterContentInit', this.options.resolveQuery);
  }

  public async ngOnInit() {
    if(this.options.resolveQuery){
      for (const key of Object.keys(this.options.resolveQuery)) {
        this.options.query[key] = await firstValueFrom(this.store.select(fromFlow.selectVariableByKey(this.options.resolveQuery[key])).pipe(take(1)));
      }
      console.log('FlowListComponent OnInit', this.options.resolveQuery);
    }

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
