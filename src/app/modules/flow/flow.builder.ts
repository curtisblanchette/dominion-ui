import { FlowProcess } from './classes/flow.process';
import { Inject, Injectable, Injector, Renderer2, RendererFactory2 } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { FlowFactory } from './flow.factory';
import { lastValueFrom, take } from 'rxjs';
import { FlowService } from './flow.service';
import { ModuleTypes } from '../../data/entity-metadata';
// import { v4 as uuidv4 } from 'uuid';
// import { EntityCollectionServiceFactory } from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class FlowBuilder {

  // public process: FlowProcess;
  // private renderer: Renderer2;

  constructor(
    private store: Store<fromFlow.FlowState>,
    // private rendererFactory: RendererFactory2,
    // private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    public process: FlowProcess,
  ) {
    // this.renderer = rendererFactory.createRenderer(null, null);
  }


  public async build(type?: string) {

    // this.process = new FlowProcess(this.store, this.flowService, this.entityCollectionServiceFactory, uuidv4());
    /**
     * Everything that is passed to factory functions must be Serializable!
     */

    // GLOBAL
    const objection = FlowFactory.objection();
    const recap = FlowFactory.recap();
    const end = FlowFactory.end();
    const notes = FlowFactory.takeNotes();

    const callType = FlowFactory.callTypeDecision(undefined, (flowService: FlowService, vars: any) => {
      flowService.startCall(vars.call_type);
    });

    const searchNListLeads = FlowFactory.searchNListLeads(undefined, (flowService: FlowService, vars: any) => {
      flowService.updateCall({leadId: vars.lead});
    });

    const outboundType = FlowFactory.outboundType();
    const searchNListContacts = FlowFactory.searchNListContacts();
    const searchNListWebLeads = FlowFactory.searchNListWebLeads();
    const createLead = FlowFactory.createLead();

    const appointmentList = FlowFactory.appointmentList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] ={
        dealId: vars.deal
      };
      return step;
    });

    const reasonForCall = FlowFactory.reasonForCall(undefined, (flowService: FlowService, vars:any, step:any) => {
      return step;
    });

    const inboundReasonForCall = FlowFactory.reasonForCall(undefined, (flowService: FlowService, vars:any, step:any) => {
      return step;
    });

    const editLead = FlowFactory.editLead(undefined, (flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    });
    const setLeadSource = FlowFactory.setLeadSource(undefined, (flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    });
    const oppList = FlowFactory.opportunityList(undefined, (flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        leadId: vars.lead
      };
      return step;
    });
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

      return step;
    }, (flowService: FlowService, vars: any, step: any) => {
      flowService.updateCall({dealId: vars.deal});
    });

    const relationshipBuilding = FlowFactory.relationshipBuilding(undefined,(flowService: FlowService, vars: any, step: any) => {
      step.variables['appointment_action'] = 'set';
      return step;
    });
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource.id, relationshipBuilding.id);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding.id, powerQuestion.id);


    const setAppointment = FlowFactory.setAppointment(undefined, (flowService: FlowService, vars: any, step: any) => {
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
        }
          break;
        case vars.call_reason === 'reschedule-appointment': {
          step.state.options.state = 'reschedule';
          step.state.data.resolveId = vars.event;
        }
          break;
        // no event selected
        case !vars.event: {
          step.state.options.state = 'set';
        }
          break;
        default: {
          step.state.options.state = 'set';
        }
      }

      return step;
    });

    // INBOUND - CALL TYPE
    const callType_inbound = FlowFactory.condition('Inbound', (vars: any) => {
      return vars['call_type'] === 'inbound';
    }, {}, searchNListLeads.id);

    const callType_outbound = FlowFactory.condition('Outbound', (vars: any) => {
      return vars['call_type'] === 'outbound';
    }, {}, outboundType.id);

    const callTypeRouter = FlowFactory.router('Call Type', '', [callType_inbound, callType_outbound]);
    const toCallTypeRouter = FlowFactory.link(callType.id, callTypeRouter.id);

    // INBOUND - NEW/EXISTING LEAD
    const existingLead_yes = FlowFactory.condition('Lead Selected', (vars: any) => {
      return !vars['new_lead'];
    }, {
      leadId: ModuleTypes.LEAD
    }, editLead.id);

    const existingLead_no = FlowFactory.condition('Create Lead', (vars: any) => {
      return vars['new_lead'];
    }, {}, createLead.id);

    const searchNListLeadsRouter = FlowFactory.router('Lead Selected', '', [existingLead_yes, existingLead_no]);
    const toSearchNListLeadsRouter = FlowFactory.link(searchNListLeads.id, searchNListLeadsRouter.id);

    // INBOUND - NEW/EXISTING DEAL
    const inboundExistingDeal_yes = FlowFactory.condition('deal Selected', (vars: any) => {
      return !vars['new_deal'];
    }, {
      leadId: ModuleTypes.DEAL
    }, editOpp.id);

    const inboundExistingLead_no = FlowFactory.condition('Create Deal', (vars: any) => {
      return vars['new_deal'];
    }, {}, createOpp.id);

    const inboundDealRouter = FlowFactory.router('Deal Decision', '', [inboundExistingDeal_yes, inboundExistingLead_no]);
    const inboundDealLink = FlowFactory.link(oppList.id, inboundDealRouter.id);

    // INBOUND - NEW LEAD SELECT CAMPAIGN
    const setLeadSourceLink = FlowFactory.link(createLead.id, setLeadSource.id);

    // INBOUND - NEW LEAD RELATIONSHIP BUILDING
    const toRelationshipBuilding2 = FlowFactory.link(createOpp.id, relationshipBuilding.id);
    // const inboundSetApptLink = FlowFactory.link(relationshipBuilding.id, setAppointment.id);
    const inboundSetApptLink = FlowFactory.link(powerQuestion.id, setAppointment.id);

    // INBOUND - REASON FOR CALL
    const inboundSetApptLink1 = FlowFactory.link(editOpp.id, inboundReasonForCall.id);

    const cancelEvent = FlowFactory.condition('Cancel/Reschedule Inbound Event',(vars: any) => {
      return vars['call_type'] === 'inbound' && ( vars['call_reason'] === 'cancel-appointment' || vars['call_reason'] === 'reschedule-appointment' );
    }, {}, appointmentList.id);

    const inboundTakeNotes = FlowFactory.condition('Inbound Take Notes', (vars: any) => {
      return vars['call_type'] === 'inbound' && vars['call_reason'] === 'take-notes';
    }, {}, notes.id);

    const reasonForCallRouter = FlowFactory.router('Call Reason', '', [cancelEvent, inboundTakeNotes]);
    const toReasonForCallRouter = FlowFactory.link(inboundReasonForCall.id, reasonForCallRouter.id);

    // INBOUND - RECAP/END

    const inboundEndCondition = FlowFactory.condition('Inbound End',(vars: any) => {
      return vars['call_type'] === 'inbound' && vars['call_reason'] === 'cancel-appointment' ;
    }, {}, end.id);

    const inboundRecapCondition = FlowFactory.condition('Inbound Recap',(vars: any) => {
      return vars['call_type'] === 'inbound' && vars['call_reason'] !== 'cancel-appointment' ;
    }, {}, recap.id);

    // const inboundEventRouter = FlowFactory.router('Inbound Event', '', [inboundEndCondition, inboundRecapCondition]);
    // const inboundEventRouterLink = FlowFactory.link(setAppointment.id, inboundEventRouter.id);

    const toInboundEnd = FlowFactory.link(recap.id, end.id);
    const toObjectionEnd = FlowFactory.link(objection.id, end.id);
    const toNotesEnd = FlowFactory.link(notes.id, end.id);

    // OUTBOUND - CONTACT OR WEB LIST
    const outboundOppWithNoOutcomes = FlowFactory.noOutcomeList();
    const outboundContactOppsWithNoOutcomes = FlowFactory.noOutcomeList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        contactId: vars.contact
      };
      return step;
    });

    const outboundWebLeads = FlowFactory.condition('Web Leads',(vars: any) => {
      return vars['outbound_type'] === 'web_leads';
    }, {}, outboundOppWithNoOutcomes.id);

    const outboundContacts = FlowFactory.condition('Search Contacts', (vars: any) => {
      return vars['outbound_type'] === 'contacts';
    }, {}, searchNListContacts.id);

    const outboundWebLeadRouter = FlowFactory.router('Outbound Type', '', [outboundWebLeads, outboundContacts]);
    const outboundWebLeadLink = FlowFactory.link(outboundType.id, outboundWebLeadRouter.id);
    const outboundContactOppsLink = FlowFactory.link(searchNListContacts.id,outboundContactOppsWithNoOutcomes.id);

    // OUTBOUND - REASON FOR CALL
    const outboundContactsOpps_ReasonForCallLink = FlowFactory.link(outboundContactOppsWithNoOutcomes.id, reasonForCall.id);
    const outboundOpps_ReasonForCallLink = FlowFactory.link(outboundOppWithNoOutcomes.id, reasonForCall.id);

    const outboundCancelRescheduleEvent = FlowFactory.condition('Reschedule/Cancel Event',(vars: any) => {
      return ['reschedule-appointment','cancel-appointment'].includes(vars['call_reason']) && vars['call_type'] === 'outbound' ;
    }, {}, appointmentList.id);

    const outboundTakeNotes = FlowFactory.condition('Take Notes',(vars: any) => {
      return vars['call_reason'] === 'take-notes' && vars['call_type'] === 'outbound';
    }, {}, notes.id);

    const outboundCancelRescheduleRouter = FlowFactory.router('Reason', '', [outboundCancelRescheduleEvent, outboundTakeNotes]);
    const outboundCancelRescheduleLink = FlowFactory.link(reasonForCall.id, outboundCancelRescheduleRouter.id);

    // OUTBOUND - APPOINTMENT
    const outboundEventLink = FlowFactory.link(appointmentList.id, setAppointment.id);

    // OUTBOUND - END/RECAP
    const outboundEventCanceled = FlowFactory.condition('Event Canceled',(vars: any) => {
      return vars['call_type'] === 'outbound' && vars['call_reason'] === 'cancel-appointment' ;
    }, {}, end.id);

    const outboundEventRescheduled = FlowFactory.condition('Event Reschedules',(vars: any) => {
      return vars['call_type'] === 'outbound' && vars['call_reason'] !== 'cancel-appointment' ;
    }, {}, recap.id);

    const outboundEventRouter = FlowFactory.router('Inbound/Outbound Event', '', [outboundEventCanceled, outboundEventRescheduled, inboundEndCondition, inboundRecapCondition]);
    const outboundEventRouterLink = FlowFactory.link(setAppointment.id, outboundEventRouter.id);
    const outboundRecapLink = FlowFactory.link(appointmentList.id, outboundEventRouterLink.id);

    ///
    this.process
      .addStep(callType)
      .addLink(toCallTypeRouter)
      .addRouter(callTypeRouter)
      .addStep(searchNListLeads)
      .addStep(outboundType)
      .addStep(reasonForCall)
      .addStep(inboundReasonForCall)
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
      .addRouter(searchNListLeadsRouter)
      .addRouter(reasonForCallRouter)
      .addRouter(inboundDealRouter)
      .addLink(toSearchNListLeadsRouter)
      .addLink(toOppList)
      .addLink(setLeadSourceLink)
      .addLink(toRelationshipBuilding1)
      .addLink(toRelationshipBuilding2)
      .addLink(inboundSetApptLink)
      .addLink(inboundSetApptLink1)
      .addLink(toReasonForCallRouter)
      .addLink(toPowerQuestion)
      .addLink(toInboundEnd)
      .addLink(inboundDealLink);


    // 'outbound'
    this.process
      .addStep(searchNListWebLeads)
      .addStep(searchNListContacts)
      .addStep(outboundContactOppsWithNoOutcomes)
      .addStep(outboundOppWithNoOutcomes)
      .addRouter(outboundWebLeadRouter)
      .addRouter(outboundCancelRescheduleRouter)
      .addRouter(outboundEventRouter)
      .addLink(outboundWebLeadLink)
      .addLink(outboundContactOppsLink)
      .addLink(outboundOpps_ReasonForCallLink)
      .addLink(outboundContactsOpps_ReasonForCallLink)
      .addLink(outboundCancelRescheduleLink)
      .addLink(outboundEventLink)
      .addLink(outboundEventRouterLink)
      .addLink(outboundRecapLink);


    // global
    this.process
      .addStep(objection)
      .addLink(toObjectionEnd)
      .addLink(toNotesEnd);

    this.store.dispatch(flowActions.UpdateFlowAction({firstStepId: callType.id, lastStepId: end.id}));
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
