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
    this.process = new FlowProcess(this.store);
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
    const oppList = FlowFactory.opportunityList({leadId: ModuleTypes.LEAD});
    const toOppList = FlowFactory.link(editLead, oppList);
    const createOpp = FlowFactory.createDeal(null, {lead: ModuleTypes.LEAD});
    const createOpp1 = FlowFactory.createDeal1();
    const editOpp = FlowFactory.editDeal(ModuleTypes.DEAL, {lead: ModuleTypes.LEAD});

    const relationshipBuilding = FlowFactory.relationshipBuilding();
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource, relationshipBuilding);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding, powerQuestion);

    const setAppointment = FlowFactory.setAppointment();
    const recap = FlowFactory.recap();

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

    const inboundSetApptLink = FlowFactory.link(relationshipBuilding, setAppointment);
    const inboundSetApptLink1 = FlowFactory.link(editOpp, setAppointment);

    // outbound
    const oppWithNoOutcomes = FlowFactory.noOutcomeList();

    const contactOppsWithNoOutcomes = FlowFactory.noOutcomeList( {
      contactId: ModuleTypes.CONTACT
    });

    const webLeads_yes = FlowFactory.condition({
      variable: 'web_lead_options',
      equals: 'web_leads'
    }, {}, oppWithNoOutcomes);

    const webLeads_no = FlowFactory.condition({
      variable: 'web_lead_options',
      equals: 'contacts'
    }, {}, searchNListContacts);

    const webLeadRouter = FlowFactory.router('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = FlowFactory.link(webLeadsType, webLeadRouter);

    const createContact = FlowFactory.createContact();
    const existingContact_no = FlowFactory.condition({
      variable: ModuleTypes.CONTACT,
      exists: false
    }, {}, createContact);

    const existingContact_yes = FlowFactory.condition({
      variable: ModuleTypes.CONTACT,
      exists: true
    }, {}, contactOppsWithNoOutcomes);

    const contactRouter = FlowFactory.router('Router', '', [existingContact_yes, existingContact_no]);
    const contactLink = FlowFactory.link(searchNListContacts, contactRouter);

    // Outbound Web Lead Conditions and Routers
    const existingOpp_no = FlowFactory.condition({
      variable: ModuleTypes.DEAL,
      exists: false
    }, {}, createOpp1);

    const existingOpp_yes = FlowFactory.condition({
      variable: ModuleTypes.DEAL,
      exists: true
    }, {}, setAppointment);

    const oppRouter = FlowFactory.router('Router', undefined, [existingOpp_yes, existingOpp_no]);

    const oppLink2 = FlowFactory.link(oppWithNoOutcomes, oppRouter);

    // const setApptLink = FlowFactory.link(oppWithNoOutcomes, setAppointment);
    // const setApptLink2 = FlowFactory.link(contactOppsWithNoOutcomes, setAppointment);
    const setApptLink3 = FlowFactory.link(createOpp1, setAppointment);
    // const oppLink = FlowFactory.link(createContact, createOpp1);

    const setAppt_yes = FlowFactory.condition( {
      variable: 'set_appointment',
      exists: true
    }, {}, recap);

    const setAppt_no = FlowFactory.condition({
      variable: 'set_appointment',
      exists: false
    }, {}, recap);

    const apptRouter = FlowFactory.router('Router', undefined, [setAppt_yes, setAppt_no]);
    const apptLink = FlowFactory.link(setAppointment, apptRouter);

    const toSetAppointment = FlowFactory.link(editOpp, setAppointment);

    const end = FlowFactory.end();
    const toInboundEnd = FlowFactory.link(recap, end);


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
      .addLink(inboundSetApptLink)
      .addLink(inboundSetApptLink1)
      .addStep(setAppointment)
      .addStep(powerQuestion)
      .addLink(toPowerQuestion)

      .addStep(editOpp)
      .addStep(createOpp)
      .addLink(toOppListRouter)
      .addLink(toSetAppointment)

      .addStep(end)
      .addLink(toInboundEnd);


    // 'outbound'
    this.process
      .addRouter(webLeadRouter)
      .addStep(searchNListWebLeads)
      .addStep(searchNListContacts)
      .addStep(createOpp1)
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
      // .addLink(setApptLink)
      // .addLink(setApptLink2)
      .addLink(setApptLink3)
      .addRouter(apptRouter)
      .addStep(recap)
      .addLink(apptLink)
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
