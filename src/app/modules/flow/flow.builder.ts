import { FlowProcess } from './classes/flow.process';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { FlowFactory } from './flow.factory';
import {  lastValueFrom, take } from 'rxjs';
import { FlowService } from './flow.service';
import { ModuleTypes } from '../../data/entity-metadata';

@Injectable({providedIn: 'root'})
export class FlowBuilder {

  constructor(
    private store: Store<fromFlow.FlowState>,
    public process: FlowProcess,
  ) {
  }


  public async build(type?: string) {

    /**
     * Everything that is passed to factory functions must be Serializable!
     */

    // GLOBAL
    const objection = FlowFactory.objection();
    const recap = FlowFactory.recap();
    const end = FlowFactory.end();
    const notes = FlowFactory.takeNotes();
    const callDirection = FlowFactory.callDirectionDecision();
    const searchLeads = FlowFactory.searchLeads();
    const outboundType = FlowFactory.outboundType();
    const searchContacts = FlowFactory.searchContacts();
    const createLead = FlowFactory.createLead((flowService: FlowService) => {
      flowService.addVariables({ call_typeId: 9 /* Sales */ });
    });

    const appointmentList = FlowFactory.appointmentList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        dealId: vars.deal
      };
      return step;
    });

    const reasonForCall = FlowFactory.reasonForCall(undefined, (flowService: FlowService, vars:any, step:any) => {
      return step;
    });

    const editLead = FlowFactory.editLead((flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    }, undefined);

    const setLeadSource = FlowFactory.setLeadSource(undefined, (flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    });

    const oppList = FlowFactory.opportunityList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        leadId: vars.lead
      };
      return step;
    }, undefined);
    const toOppList = FlowFactory.link(editLead.id, oppList.id);

    const createOpp = FlowFactory.createDeal((flowService: FlowService, vars: any, step: any) => {
      step.state.data['payload'] = {
        leadId: vars.lead
      };
      return step;
    });

    const editOpp = FlowFactory.editDeal((flowService: FlowService, vars: any, step: any) => {
      step.state.data = {
        id: vars.deal,
        leadId: vars.lead
      };

      flowService.addVariables({ call_typeId: 4 /* Sales */ });

      return step;
    });

    const relationshipBuilding = FlowFactory.relationshipBuilding(undefined,(flowService: FlowService, vars: any, step: any) => {
      step.variables['appointment_action'] = 'set';
      return step;
    });
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource.id, relationshipBuilding.id);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding.id, powerQuestion.id);


    const setAppointment = FlowFactory.setAppointment((flowService: FlowService, vars: any, step: any) => {
      // globals
      step.state.options['payload'] = {
        contactId: vars.contact,
        dealId: vars.deal,
        leadId: vars.lead
      };

      switch (true) {
        case vars.call_reason === 'cancel-appointment' : {
          step.state.options.state = 'cancel';
          step.state.data.resolveId = vars.event;
          flowService.addVariables({ call_outcomeId: 4 /* Cancel Appointment */ });

        }
          break;
        case vars.call_reason === 'reschedule-appointment': {
          step.state.options.state = 'reschedule';
          step.state.data.resolveId = vars.event;
          flowService.addVariables({ call_outcomeId: 3 /* Reschedule Appointment */ });
        }
          break;
        // no event selected
        case !vars.event: {
          step.state.options.state = 'set';
          flowService.addVariables({ call_outcomeId: 2 /* Set Appointment */ });
        }
          break;
        default: {
          step.state.options.state = 'set';
        }
      }

      return step;
    });

    // INBOUND - CALL TYPE
    const callDirection_inbound = FlowFactory.condition(
      'Inbound Condition',
      (vars: any) => (vars['call_direction'] === 'inbound'),
      {},
      searchLeads.id
    );

    const callDirection_outbound = FlowFactory.condition(
      'Outbound Condition',
      (vars: any) => (vars['call_direction'] === 'outbound'),
      {},
      outboundType.id
    );

    const callDirectionRouter = FlowFactory.router(
      'Call Direction Router',
      '',
      [
        callDirection_inbound,
        callDirection_outbound
      ]
    );
    const toCallDirectionRouter = FlowFactory.link(callDirection.id, callDirectionRouter.id);

    // INBOUND - NEW/EXISTING LEAD
    const editLeadCondition = FlowFactory.condition(
      'Lead Selected',
      (vars: any) => (!vars['new_lead']),
      {
       leadId: ModuleTypes.LEAD
      },
      editLead.id
    );

    const createLeadCondition = FlowFactory.condition(
      'Create Lead Condition',
      (vars: any) => (vars['new_lead']),
      {},
      createLead.id
    );

    const searchLeadsRouter = FlowFactory.router(
      'Lead Selected Router',
      '',
      [
        editLeadCondition,
        createLeadCondition
      ]
    );
    const toSearchLeadsRouter = FlowFactory.link(searchLeads.id, searchLeadsRouter.id);

    // INBOUND - NEW/EXISTING DEAL
    const existingDeal_yes = FlowFactory.condition(
      'Deal Selected Condition',
      (vars: any) => (!vars['new_deal']),
      {
        leadId: ModuleTypes.DEAL
      },
      editOpp.id
    );

    const existingLead_no = FlowFactory.condition(
      'Create Deal Condition',
      (vars: any) => (vars['new_deal']),
      {},
      createOpp.id
    );

    const inboundDealRouter = FlowFactory.router(
      'Deal Decision',
      '',
      [
        existingDeal_yes,
        existingLead_no
      ]
    );
    const inboundDealLink = FlowFactory.link(oppList.id, inboundDealRouter.id);

    // INBOUND - NEW LEAD SELECT CAMPAIGN
    const setLeadSourceLink = FlowFactory.link(createLead.id, setLeadSource.id);

    // INBOUND - NEW LEAD RELATIONSHIP BUILDING
    const toRelationshipBuilding2 = FlowFactory.link(createOpp.id, relationshipBuilding.id);
    const inboundSetApptLink = FlowFactory.link(powerQuestion.id, setAppointment.id);

    // INBOUND - REASON FOR CALL
    const toReasonForCall = FlowFactory.link(editOpp.id, reasonForCall.id);

    // INBOUND - RECAP/END
    const endCondition = FlowFactory.condition(
      'End Condition',
      (vars: any) => (vars['call_reason'] === 'cancel-appointment'),
      {},
      end.id
    );

    const recapCondition = FlowFactory.condition(
      'Recap Condition',
      (vars: any) => (vars['call_reason'] !== 'cancel-appointment'),
      {},
      recap.id
    );

    const toInboundEnd = FlowFactory.link(recap.id, end.id);
    const toObjectionEnd = FlowFactory.link(objection.id, end.id);
    const toNotesEnd = FlowFactory.link(notes.id, end.id);

    // OUTBOUND
    // SearchContact/New Lead
    // Opp Follow Up
    // Web List

    const oppFollowUpList = FlowFactory.oppFollowUpList();
    const oppFollowUp = FlowFactory.oppFollowUp(undefined, (flowService: FlowService, vars: any, step: any) => {

    });
    const toOppFollowUp = FlowFactory.link(oppFollowUpList.id, oppFollowUp.id);

    const webLeadsList = FlowFactory.webLeadsList();

    const outboundWebLeads = FlowFactory.condition(
      'Web Leads',
      (vars: any) => (vars['outbound_type'] === 'web-leads'),
      {},
      webLeadsList.id
    );

    const outboundContacts = FlowFactory.condition(
      'Search Contacts',
      (vars: any) => (vars['outbound_type'] === 'contacts'),
      {},
      searchContacts.id
    );

    const outboundOppFollowUp = FlowFactory.condition(
      'Search Contacts',
      (vars: any) => (vars['outbound_type'] === 'opp-follow-up'),
      {},
      oppFollowUpList.id
    );

    const outboundTypeRouter = FlowFactory.router(
      'Outbound Type',
      '',
      [
        outboundWebLeads,
        outboundContacts,
        outboundOppFollowUp
      ]
    );
    const outboundTypeRouterLink = FlowFactory.link(outboundType.id, outboundTypeRouter.id);

    // OUTBOUND - EXISTING CONTACT / NEW LEAD
    const existingContact_yes = FlowFactory.condition(
      'Contact Selected',
      (vars: any) => (!vars['new_lead']),
      {
        contactId: ModuleTypes.CONTACT
      },
      oppList.id
    );

    const existingContact_no = FlowFactory.condition(
      'Create Lead',
      (vars: any) => (vars['new_lead']),
      {},
      createLead.id
    );

    const searchContactsRouter = FlowFactory.router(
      'Lead Selected',
      '',
      [
        existingContact_yes,
        existingContact_no
      ]
    );
    const toSearchContactsRouter = FlowFactory.link(searchContacts.id, searchContactsRouter.id);

    const cancelCondition = FlowFactory.condition(
      'Cancel Appointment',
      (vars: any) => (vars['call_reason'] === 'cancel-appointment'),
      {},
      appointmentList.id
    );

    const rescheduleCondition = FlowFactory.condition(
      'Reschedule Appointment Condition',
      (vars: any) => (vars['call_reason'] === 'reschedule-appointment'),
      {},
      appointmentList.id
    );

    const setAppointmentCondition = FlowFactory.condition(
      'Set Appointment',
      (vars: any) => (vars['call_reason'] === 'set-appointment'),
      {},
      powerQuestion.id
    );

    const takeNotesCondition = FlowFactory.condition(
      '[Outbound] Take Notes',
      (vars: any) => (vars['call_reason'] === 'take-notes'),
      {},
      notes.id
    );

    const outboundSetCancelRescheduleRouter = FlowFactory.router(
      '[Outbound] Reason for Call',
      '',
      [
        cancelCondition,
        rescheduleCondition,
        setAppointmentCondition,
        takeNotesCondition
      ]
    );
    const outboundSetCancelRescheduleLink = FlowFactory.link(reasonForCall.id, outboundSetCancelRescheduleRouter.id);

    // OUTBOUND - APPOINTMENT
    const outboundEventLink = FlowFactory.link(appointmentList.id, setAppointment.id);

    // OUTBOUND - END/RECAP
    const eventCanceled = FlowFactory.condition(
      'Event Canceled Condition',
      (vars: any) => (vars['call_reason'] === 'cancel-appointment'),
      {},
      end.id
    );

    const eventRescheduled = FlowFactory.condition(
      'Event Rescheduled Condition',
      (vars: any) => (vars['call_reason'] !== 'cancel-appointment'),
      {},
      recap.id
    );

    const outboundEventRouter = FlowFactory.router(
      'Call Reason Router',
      '',
      [
        eventCanceled,
        eventRescheduled,
        endCondition,
        recapCondition
      ]
    );
    const outboundEventRouterLink = FlowFactory.link(setAppointment.id, outboundEventRouter.id);
    const outboundRecapLink = FlowFactory.link(appointmentList.id, outboundEventRouterLink.id);

    ///
    this.process
      .addStep(callDirection)
      .addLink(toCallDirectionRouter)
      .addRouter(callDirectionRouter)
      .addStep(searchLeads)
      .addStep(outboundType)
      .addStep(reasonForCall)
      .addLink(toReasonForCall)
      .addStep(appointmentList)
      .addStep(setAppointment)
      .addStep(recap)
      .addStep(end)
      .addStep(notes);

    // 'inbound'
    this.process
      .addStep(oppList)
      .addStep(createLead)
      .addStep(editLead)
      .addStep(setLeadSource)
      .addStep(relationshipBuilding)
      .addStep(powerQuestion)
      .addStep(editOpp)
      .addStep(createOpp)
      .addRouter(searchLeadsRouter)
      .addRouter(inboundDealRouter)
      .addLink(toSearchLeadsRouter)
      .addLink(toOppList)
      .addLink(setLeadSourceLink)
      .addLink(toRelationshipBuilding1)
      .addLink(toRelationshipBuilding2)
      .addLink(inboundSetApptLink)
      .addLink(toPowerQuestion)
      .addLink(toInboundEnd)
      .addLink(inboundDealLink);


    // 'outbound'
    this.process
      .addStep(oppFollowUp)
      .addStep(webLeadsList)
      .addStep(oppFollowUpList)
      .addLink(toOppFollowUp)

      .addStep(searchContacts)
      .addRouter(searchContactsRouter)
      .addLink(toSearchContactsRouter)

      .addRouter(outboundTypeRouter)
      .addRouter(outboundSetCancelRescheduleRouter)
      .addRouter(outboundEventRouter)
      .addLink(outboundTypeRouterLink)
      // .addLink(outboundOpps_ReasonForCallLink)
      // .addLink(outboundContactsOpps_ReasonForCallLink)
      .addLink(outboundSetCancelRescheduleLink)
      .addLink(outboundEventLink)
      .addLink(outboundEventRouterLink)
      .addLink(outboundRecapLink);


    // global
    this.process
      .addStep(objection)
      .addLink(toObjectionEnd)
      .addLink(toNotesEnd);

    this.store.dispatch(flowActions.UpdateFlowAction({firstStepId: callDirection.id, lastStepId: end.id}));
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
