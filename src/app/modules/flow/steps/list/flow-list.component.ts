import { AfterContentInit, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FlowService } from '../../flow.service';
import { Store } from '@ngrx/store';
import { FiizListComponent } from '../../../../common/components/ui/list/list.component';
import { ModuleTypes } from '../../../../data/entity-metadata';
import * as fromFlow from '../../store/flow.reducer';

@Component({
  selector: 'flow-list',
  templateUrl: './flow-list.component.html',
  styleUrls: ['../_base.scss', './flow-list.component.scss']
})
export class FlowListComponent implements OnDestroy, AfterContentInit, OnInit {
  public static reference: string = 'FlowListComponent';
  private flowStepId: string | undefined;

  @Input('data') data: any;
  @Input('module') module: any;
  @Input('options') options: any;

  @Output('values') values: EventEmitter<any> = new EventEmitter();
  @Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();

  @ViewChild(FiizListComponent, {static: true}) cmp: FiizListComponent;

  @HostBinding('attr.data-qa') qaAttribute: string = 'undetermined-list';

  constructor(
    public store: Store<fromFlow.FlowState>,
    public flowService: FlowService
  ) {
    this.store.select(fromFlow.selectCurrentStepId).subscribe(currentStepId => {
      if (currentStepId) {
        this.flowStepId = currentStepId;
      }
    });
  }

  public async ngAfterContentInit() {

    console.log('FlowListComponent AfterContentInit');
    // this.flowService.updateStep(this.flowStepId, {variables: {[`new_${this.module}`]: false}});
  }

  public async ngOnInit() {
    this.qaAttribute = this.module + '-list';
  }

  public ngOnDestroy(): void {
    console.log('Flow List component destroy');
  }

  public emitValues(value: { module: string, record: any }): void {
    let variables: any = {};

    if (value.record) {
      variables[value.module] = value.record.id;
      const moduleNames:Array<string> = [ModuleTypes.CONTACT, ModuleTypes.LEAD, ModuleTypes.DEAL];
      moduleNames.forEach(element => {
        variables[`new_${element}`] = false;
      });

      // If selected record has relationships...
      // Sometimes they have multiple contacts, but we're only showing the first one.`
      // TODO make multiple contacts/leads work

      // lists are used for deciding the "context" of the call
      // seems like the right location to set
      // contextual variables that can be used by [dictation.pipe.ts, HTML Templates]

      if (value.record.contactId || (value.record.contacts && value.record.contacts.length)) {
        variables[ModuleTypes.CONTACT] = value.record.contactId || value.record.contacts[0]?.id;
        if(value.record?.contacts?.length) {
          // there's at least 1 contact related to the selected record
          variables['contact_name'] = value.record.contacts[0]?.firstName + ' ' + value.record.contacts[0]?.lastName
        }
      }
      if (value.record.leadId || (value.record.leads && value.record.leads.length)) {
        // there's at leads 1 lead related to the selected record
        variables[ModuleTypes.LEAD] = value.record.leadId || value.record.leads[0]?.id;
      }

      if(value.record.stage) {
        // the deal stage can be set to a context variable
        variables['deal_stage'] = value.record.stage.name;
      }

      this.flowService.updateStep(this.flowStepId, {variables, valid: true}, 'merge');
    } else {
      // remove variables
      this.flowService.updateStep(this.flowStepId, {variables: {}, valid: false}, 'overwrite');
    }

    return this.values.next(value);
  }

  /**
   * The "create New" button stores a variable example: { new_lead: true }
   * which can later be referenced by FlowConditions
   **/
  public create($event: Event) {
    this.flowService.updateStep(this.flowStepId, {valid: true, variables: {[`new_${this.options.createModule || this.module}`]: true}});
    this.onCreate.next(true);
  }

}
