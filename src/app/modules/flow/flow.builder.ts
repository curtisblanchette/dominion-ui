import { FlowProcess } from './_core/classes/flow.process';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import { FlowFactory } from './flow.factory';
import { FlowListParams, FlowTextComponent } from './_core';
import { lastValueFrom, take } from 'rxjs';

export class FlowBuilder {

  public process: FlowProcess;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>
  ) {
    this.reset();
  }

  public reset(): void {
    this.process = new FlowProcess(this.store);
  }

  public async build(type?: string) {

    // select call type
    const callType = FlowFactory.callTypeDecision();
    const searchNListLeads = FlowFactory.searchNListLeads()
    const webLeadsType = FlowFactory.webLeadsType();
    const searchNListWebLeads = FlowFactory.searchNListWebLeads();
    const createLead = FlowFactory.createLead();
    const editLead = FlowFactory.editLead(() => this.getVariable('lead'));
    const setLeadSource = FlowFactory.setLeadSource(() => this.getVariable('lead'));
    const oppList = FlowFactory.selectExistingOpp(() => ({
      /**
       * by passing a function to the `query` argument
       * we can defer the collection of variables to a later time
       */
      leadId: this.getVariable('lead')
    }));
    const toOppList = FlowFactory.link(editLead, oppList);
    const createOpp = FlowFactory.createDeal(undefined, async () => ({ leadId: await this.getVariable('lead') }));
    const editOpp = FlowFactory.editDeal(() => this.getVariable('deal'), () => {leadId: this.getVariable('lead')});

    const relationshipBuilding = FlowFactory.relationshipBuilding();
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource, relationshipBuilding);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding, powerQuestion);

    // inbound
    const inboundCond = FlowFactory.condition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    }, searchNListLeads);

    const outboundCond = FlowFactory.condition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, webLeadsType);

    const callTypeRouter = FlowFactory.router('Router', '', [inboundCond, outboundCond]);
    const toCallTypeRouter = FlowFactory.link(callType, callTypeRouter);

    const existingLead_yes = FlowFactory.condition(async () => {
      const leadId = await this.getVariable('lead');

      if (leadId) {
        const params = new FlowListParams();
        params.setParam('leadId', leadId);
        return params;
      }

      return false;
    }, editLead);

    const existingLead_no = FlowFactory.condition(async () => {
      const lead = await this.getVariable('lead');
      /** Conditions can also update FlowStep members */
      return !lead;
    }, createLead);


    const existingDeal_yes = FlowFactory.condition(async () => {
      const dealId = await this.getVariable('deal');

      if (dealId) {
        const params = new FlowListParams();
        params.setParam('dealId', dealId);
        return params;
      }

      return false;
    }, editOpp);

    const searchNListLeadsRouter = FlowFactory.router('Router', '', [existingLead_yes, existingLead_no]);
    const toSearchNListLeadsRouter = FlowFactory.link(searchNListLeads, searchNListLeadsRouter);

    const existingDeal_no = FlowFactory.condition(async () => {
      const deal = await this.getVariable('deal');
      /** Conditions can also update FlowStep members */
      return !deal;
    }, createOpp);

    const oppListRouter = FlowFactory.router('Router', '', [existingDeal_yes, existingDeal_no]);
    const toOppListRouter = FlowFactory.link(oppList, oppListRouter);

    const setLeadSourceLink = FlowFactory.link(createLead, setLeadSource);

    const toRelationshipBuilding2 = FlowFactory.link(createOpp, relationshipBuilding);

    // outbound
    const webLeads_yes = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, searchNListWebLeads);

    const webLeads_no = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, searchNListLeads);

    const webLeadRouter = FlowFactory.router('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = FlowFactory.link(webLeadsType, webLeadRouter);

    this.process
      .addStep(callType)
      .addLink(toCallTypeRouter)
      .addRouter(callTypeRouter)
      .addStep(searchNListLeads)
      .addStep(webLeadsType);

    // 'inbound'
    this.process
      .addRouter(searchNListLeadsRouter)
      .addLink(toSearchNListLeadsRouter)
      .addStep(oppList)
      .addLink(toOppList)
      .addStep(createLead)
      .addStep(editLead)
      .addLink(setLeadSourceLink)
      .addStep(setLeadSource)
      .addStep(relationshipBuilding)
      .addLink(toRelationshipBuilding1)
      .addLink(toRelationshipBuilding2)
      .addStep(powerQuestion)
      .addLink(toPowerQuestion)

      .addStep(editOpp)
      .addStep(createOpp)
      .addLink(toOppListRouter)


    // 'outbound'
    this.process
      .addRouter(webLeadRouter)
      .addStep(searchNListWebLeads)
      .addStep(searchNListLeads)
      .addLink(webLeadLink)


  }

  public async getVariable(key?: string): Promise<any> {
    let value;

    if (key) {
      value = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey(key)).pipe(take(1)));
    } else {
      value = await lastValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
    }

    return value;
  }


}
