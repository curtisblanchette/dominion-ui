import { FlowProcess } from './_core/classes/flow.process';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import { FlowFactory } from './flow.factory';
import { FlowListParams, FlowTextComponent } from './_core';
import { firstValueFrom, take } from 'rxjs';

export class FlowBuilder {

  public process: FlowProcess;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
  ) {
    this.reset();
  }

  public reset(): void {
    this.process = new FlowProcess(this.store);
  }

  public async build(type?: string) {

    // select call type
    const callType = FlowFactory.callTypeDecision();
    const searchNListContacts = FlowFactory.searchNListContacts()
    const webLeadsType = FlowFactory.webLeadsType();
    const searchNListWebLeads = FlowFactory.searchNListWebLeads();
    const createNewLead = FlowFactory.createNewLead();
    const selectExistingOpp = FlowFactory.selectExistingOpp();

    const inboundCond = FlowFactory.condition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    }, searchNListContacts);

    const outboundCond = FlowFactory.condition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, webLeadsType);

    const callTypeRouter = FlowFactory.router('Router', '', [inboundCond, outboundCond]);
    const callTypeLink = FlowFactory.link(callType, callTypeRouter);

    const existingLead_yes = FlowFactory.condition(async () => {
      const leadId = await this.getVariable('lead');
      if (leadId) {
        const params = new FlowListParams();
        params.setParam('leadId', leadId);
        return params;
      }
      return false;

    }, selectExistingOpp);

    const existingLead_no = FlowFactory.condition(async () => {
      const lead = await this.getVariable('lead');
      return lead === null;
    }, createNewLead);

    const searchNListContactsRouter = FlowFactory.router('Router', '', [existingLead_yes, existingLead_no]);
    const searchNListContactsLink = FlowFactory.link(searchNListContacts, searchNListContactsRouter);

    // outbound
    const webLeads_yes = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, searchNListWebLeads);

    const webLeads_no = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, searchNListContacts);

    const webLeadRouter = FlowFactory.router('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = FlowFactory.link(webLeadsType, webLeadRouter);


    //test
    const bogusStep = FlowFactory.step({nodeText: 'bogus', nodeIcon: 'fa-smile', data: {
      template: ''
      }, component: FlowTextComponent});
    const bogusStep2 = FlowFactory.step({nodeText: 'bogus', nodeIcon: 'fa-smile', data: {
        template: ''
      }, component: FlowTextComponent});
    const bogusLink = FlowFactory.link(selectExistingOpp, bogusStep);
    const bogusLink2 = FlowFactory.link(bogusStep, bogusStep2);
    ///
    this.process
      .addStep(callType)
      .addRouter(callTypeRouter)
      .addStep(searchNListContacts)
      .addStep(webLeadsType)
      .addLink(callTypeLink);

    // switch (type) {
    //   case 'inbound':

    this.process
      .addRouter(searchNListContactsRouter)
      .addStep(selectExistingOpp)
      .addStep(createNewLead)
      .addLink(searchNListContactsLink)
      .addStep(bogusStep)
      .addStep(bogusStep2)
      .addLink(bogusLink)
      .addLink(bogusLink2)

    //   break;
    //
    // case 'outbound':

    this.process
      .addRouter(webLeadRouter)
      .addStep(searchNListWebLeads)
      .addStep(searchNListContacts)
      .addLink(webLeadLink)
    //     break;
    //
    // }

  }

  public async getVariable(key?: string) {
    let value;

    if (key) {
      value = await firstValueFrom(this.store.select(fromFlow.selectVariableByKey(key)).pipe(take(1)));
    } else {
      value = await firstValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
    }

    return value;
  }


}
