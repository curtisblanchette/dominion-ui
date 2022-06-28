import { FlowProcess } from './classes/flow.process';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import { FlowFactory } from './flow.factory';
import { FlowListParams } from './index';
import { lastValueFrom, take } from 'rxjs';
import { FlowService } from './flow.service';

export class FlowBuilder {

  public process: FlowProcess;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
    @Inject(Store) private flowService: FlowService
  ) {
    this.reset();
  }

  public reset(): void {
    this.process = new FlowProcess(this.store);
  }

  public async build(type?: string) {

    const objection = FlowFactory.objection();
    // select call type
    const callType = FlowFactory.callTypeDecision();
    const searchNListLeads = FlowFactory.searchNListLeads()
    const webLeadsType = FlowFactory.webLeadsType();
    const searchNListContacts = FlowFactory.searchNListContacts()
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
    const createOpp = FlowFactory.createDeal(undefined, async () => (this.getVariable('lead')));
    const editOpp = FlowFactory.editDeal(() => this.getVariable('deal'), () => (this.getVariable('lead')));

    const relationshipBuilding = FlowFactory.relationshipBuilding();
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource, relationshipBuilding);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding, powerQuestion);

    // inbound
    const inboundCond = FlowFactory.condition(async () => {
      const isInbound = await this.getVariable('call_type') === 'inbound';
      if(isInbound) {
        this.flowService.startCall('inbound');
      }
      return isInbound;

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
    const oppWithNoOutcomes = FlowFactory.selectExistingOpp( () => ({
      stageId : '2,4,5' // TODO get these from the lookups
    }));

    const contactOppsWithNoOutcomes = FlowFactory.selectExistingOpp( () => ({
      stageId : '2,4,5',
      contactId : this.getVariable('contact')
    }));

    const setAppointment = FlowFactory.setAppointment();
    const recap = FlowFactory.recap();

    const webLeads_yes = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, oppWithNoOutcomes);

    const webLeads_no = FlowFactory.condition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, searchNListContacts);

    const webLeadRouter = FlowFactory.router('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = FlowFactory.link(webLeadsType, webLeadRouter);

    const createContact = FlowFactory.createContact();
    const existingContact_no = FlowFactory.condition(async () => {
      const contact = await this.getVariable('contact');
      return !contact;
    }, createContact);

    const existingContact_yes = FlowFactory.condition(async () => {
      const contact = await this.getVariable('contact');
      return contact
    }, contactOppsWithNoOutcomes);

    const contactRouter = FlowFactory.router('Router', '', [existingContact_yes, existingContact_no]);
    const contactLink = FlowFactory.link(searchNListContacts, contactRouter);

    const existingOpp_no = FlowFactory.condition(async () => {
      const deal = await this.getVariable('deal');
      return !deal;
    }, createOpp);

    const existingOpp_yes = FlowFactory.condition(async () => {
      const deal = await this.getVariable('deal');
      return deal
    }, setAppointment);

    const oppRouter = FlowFactory.router('Router', '', [existingOpp_yes, existingOpp_no]);
    const oppLink2 = FlowFactory.link(oppWithNoOutcomes, oppRouter);
    
    const setApptLink = FlowFactory.link(oppWithNoOutcomes, setAppointment);
    const setApptLink2 = FlowFactory.link(contactOppsWithNoOutcomes, setAppointment);
    const setApptLink3 = FlowFactory.link(createOpp, setAppointment);
    const oppLink = FlowFactory.link(createContact, createOpp);

    const setAppt_yes = FlowFactory.condition( async() => {
      return await this.getVariable('set_appointment');
    }, recap);

    const setAppt_no = FlowFactory.condition( async() => {
      return await this.getVariable('set_appointment');
    }, recap);

    const apptRouter = FlowFactory.router('Router', '', [setAppt_yes, setAppt_no]);
    const apptLink = FlowFactory.link(setAppointment, apptRouter);

    ///
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
      .addStep(searchNListContacts)
      .addRouter(oppRouter)
      .addLink(oppLink2)
      .addLink(webLeadLink)
      .addRouter(contactRouter)
      .addLink(contactLink)
      .addStep(oppList)
      .addLink(toOppList)
      .addStep(createContact)

      .addStep(oppWithNoOutcomes)
      .addStep(contactOppsWithNoOutcomes)
      .addStep(setAppointment)
      .addLink(setApptLink)
      .addLink(setApptLink2)
      .addLink(setApptLink3)
      .addRouter(apptRouter)
      .addStep(recap)
      .addLink(apptLink)
      .addLink(oppLink)

    // global

    this.process
      .addStep(objection);

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
