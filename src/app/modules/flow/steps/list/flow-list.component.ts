import { AfterContentInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FlowService } from '../../flow.service';
import { DominionType } from '../../../../common/models';
import { FlowState } from '../../store/flow.reducer';
import { Store } from '@ngrx/store';
import { FiizListComponent } from '../../../../common/components/ui/list/list.component';
import { ModuleTypes } from '../../../../data/entity-metadata';

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

    console.log('FlowListComponent AfterContentInit');
  }

  public async ngOnInit() {

  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public emitValues( value: { module: string, record: any } ): void {
    this.values.next(value);

    let variables: any = {};


    variables[value.module] = value.record?.id;

    /**
     * If selected record has relationships...
     * Store them variables, Yo!
     * @example `Sometimes they have multiple contacts, but we're only showing the first one.`
     * TODO make multiple contacts/leads work
     */
    if( value?.record?.contactId || ( value.record?.contacts && value.record?.contacts.length ) ){
      variables[ModuleTypes.CONTACT] = value.record?.contactId || value.record?.contacts[0]?.id;
    }
    if( value.record?.leadId || ( value.record?.leads && value.record?.leads.length ) ){
      variables[ModuleTypes.LEAD] = value.record.leadId || value.record?.leads[0]?.id;
    }

    this.flowService.addVariables(variables);


    return this.values.next(value);
  }


  public create($event: Event) {
    this.onCreate.next(true);
  }

}
