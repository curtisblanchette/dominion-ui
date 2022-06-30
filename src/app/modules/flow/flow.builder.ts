import { FlowProcess } from './classes/flow.process';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import { FlowFactory } from './flow.factory';
import { lastValueFrom, take } from 'rxjs';
import { FlowService } from './flow.service';
import { ModuleTypes } from '../../data/entity-metadata';

export class FlowBuilder {

  public process: FlowProcess;

  constructor(
    @Inject(Store) private store: Store<fromFlow.FlowState>,
    @Inject(Store) private flowService: FlowService
  ) {
    this.process = new FlowProcess(this.store);
  }

  public reset(): void {

  }

  public async build(type?: string) {
    /**
     * Everything that is passed to factory functions must be Serializable!
     * This means no Functions!
     */

    const objection = FlowFactory.objection();
    // select call type
    const callType = FlowFactory.callTypeDecision();
    const searchNListLeads = FlowFactory.searchNListLeads()
    const webLeadsType = FlowFactory.webLeadsType();
    const searchNListContacts = FlowFactory.searchNListContacts()
    const searchNListWebLeads = FlowFactory.searchNListWebLeads();
    const createLead = FlowFactory.createLead();
    const editLead = FlowFactory.editLead(ModuleTypes.LEAD);
    const setLeadSource = FlowFactory.setLeadSource(ModuleTypes.LEAD);
    const oppList = FlowFactory.selectExistingOpp({leadId: ModuleTypes.LEAD});
    const toOppList = FlowFactory.link(editLead, oppList);
    const createOpp = FlowFactory.createDeal(null, {lead: ModuleTypes.LEAD});
    const editOpp = FlowFactory.editDeal(ModuleTypes.DEAL, {lead: ModuleTypes.LEAD});

    const relationshipBuilding = FlowFactory.relationshipBuilding();
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource, relationshipBuilding);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding, powerQuestion);

    // inbound
    const inboundCond = FlowFactory.condition({
      variable: 'call_type',
      equals: 'inbound',
      trigger: {
        service: 'FlowService',
        fn: 'startCall',
        args: ['inbound']
      }
    },{}, searchNListLeads);

    const outboundCond = FlowFactory.condition({
      variable: 'call_type',
      equals: 'outbound'
    }, {},  webLeadsType);

    const callTypeRouter = FlowFactory.router('Router', '', [inboundCond, outboundCond]);
    const toCallTypeRouter = FlowFactory.link(callType, callTypeRouter);

    const existingLead_yes = FlowFactory.condition({
        variable: ModuleTypes.LEAD,
        exists: true,
      }, {
        leadId: ModuleTypes.LEAD
      }, editLead);


    const existingLead_no = FlowFactory.condition({
      variable: 'lead',
      exists: false,
    }, {}, createLead);

    const searchNListLeadsRouter = FlowFactory.router('Router', '', [existingLead_yes, existingLead_no]);
    const toSearchNListLeadsRouter = FlowFactory.link(searchNListLeads, searchNListLeadsRouter);

    const existingDeal_no = FlowFactory.condition({
      variable: 'deal',
      exists: false,
    }, {}, createOpp);

    const existingDeal_yes = FlowFactory.condition({
      variable: 'deal',
      exists: true,
    }, {
      id: ModuleTypes.DEAL
    }, editOpp);

    const oppListRouter = FlowFactory.router('Router', '', [existingDeal_yes, existingDeal_no]);
    const toOppListRouter = FlowFactory.link(oppList, oppListRouter);

    const setLeadSourceLink = FlowFactory.link(createLead, setLeadSource);

    const toRelationshipBuilding2 = FlowFactory.link(createOpp, relationshipBuilding);

    // outbound
    const oppWithNoOutcomes = FlowFactory.selectExistingOpp( {
      stageId: '2,4,5' // TODO get these from the lookups
    });

    const contactOppsWithNoOutcomes = FlowFactory.selectExistingOpp( {
      stageId: '2,4,5',
      contactId: ModuleTypes.CONTACT
    });
    //
    // const setAppointment = FlowFactory.setAppointment();
    // const recap = FlowFactory.recap();
    //
    // const webLeads_yes = FlowFactory.condition(async () => {
    //   return await this.getVariable('web_lead_options') === 'web_leads';
    // }, oppWithNoOutcomes);
    //
    // const webLeads_no = FlowFactory.condition(async () => {
    //   return await this.getVariable('web_lead_options') === 'contacts';
    // }, searchNListContacts);
    //
    // const webLeadRouter = FlowFactory.router('Router', '', [webLeads_yes, webLeads_no]);
    // const webLeadLink = FlowFactory.link(webLeadsType, webLeadRouter);
    //
    // const createContact = FlowFactory.createContact();
    // const existingContact_no = FlowFactory.condition(async () => {
    //   const contact = await this.getVariable('contact');
    //   return !contact;
    // }, createContact);
    //
    // const existingContact_yes = FlowFactory.condition(async () => {
    //   const contact = await this.getVariable('contact');
    //   return contact
    // }, contactOppsWithNoOutcomes);
    //
    // const contactRouter = FlowFactory.router('Router', '', [existingContact_yes, existingContact_no]);
    // const contactLink = FlowFactory.link(searchNListContacts, contactRouter);
    //
    // const existingOpp_no = FlowFactory.condition(async () => {
    //   const deal = await this.getVariable('deal');
    //   return !deal;
    // }, createOpp);
    //
    // const existingOpp_yes = FlowFactory.condition(async () => {
    //   const deal = await this.getVariable('deal');
    //   return deal
    // }, setAppointment);
    //
    // const oppRouter = FlowFactory.router('Router', '', [existingOpp_yes, existingOpp_no]);
    // const oppLink2 = FlowFactory.link(oppWithNoOutcomes, oppRouter);
    //
    // const setApptLink = FlowFactory.link(oppWithNoOutcomes, setAppointment);
    // const setApptLink2 = FlowFactory.link(contactOppsWithNoOutcomes, setAppointment);
    // const setApptLink3 = FlowFactory.link(createOpp, setAppointment);
    // const oppLink = FlowFactory.link(createContact, createOpp);
    //
    // const setAppt_yes = FlowFactory.condition( async() => {
    //   return await this.getVariable('set_appointment');
    // }, recap);
    //
    // const setAppt_no = FlowFactory.condition( async() => {
    //   return await this.getVariable('set_appointment');
    // }, recap);
    //
    // const apptRouter = FlowFactory.router('Router', '', [setAppt_yes, setAppt_no]);
    // const apptLink = FlowFactory.link(setAppointment, apptRouter);

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
      // .addLink(toRelationshipBuilding2)
      .addStep(powerQuestion)
      .addLink(toPowerQuestion)

      .addStep(editOpp)
      .addStep(createOpp)
      .addLink(toOppListRouter)


    // 'outbound'
    this.process
      // .addRouter(webLeadRouter)
      .addStep(searchNListWebLeads)
      .addStep(searchNListContacts)
      // .addRouter(oppRouter)
      // .addLink(oppLink2)
      // .addLink(webLeadLink)
      // .addRouter(contactRouter)
      // .addLink(contactLink)
      .addStep(oppList)
      .addLink(toOppList)
      // .addStep(createContact)

      // .addStep(oppWithNoOutcomes)
      // .addStep(contactOppsWithNoOutcomes)
      // .addStep(setAppointment)
      // .addLink(setApptLink)
      // .addLink(setApptLink2)
      // .addLink(setApptLink3)
      // .addRouter(apptRouter)
      // .addStep(recap)
      // .addLink(apptLink)
      // .addLink(oppLink)

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
