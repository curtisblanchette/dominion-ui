import { FlowProcess } from './classes/flow.process';
import { Inject, Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { FlowFactory } from './flow.factory';
import { lastValueFrom, take } from 'rxjs';
import { FlowService } from './flow.service';
import { ModuleTypes } from '../../data/entity-metadata';
import { v4 as uuidv4 } from 'uuid';

@Injectable({providedIn: 'root'})
export class FlowBuilder {

  public process: FlowProcess;

  constructor(
    private store: Store<fromFlow.FlowState>,
    @Inject(Injector) private readonly injector: Injector
  ) {

  }

  private get flowService() {
    return this.injector.get(FlowService);
  }

  public build(type?: string) {
    this.process = new FlowProcess(this.store, uuidv4());
    /**
     * Everything that is passed to factory functions must be Serializable!
     */
    const objection = FlowFactory.objection();
    // select call type
    const callType = FlowFactory.callTypeDecision(undefined, (flowService: FlowService, vars: any) => {
      flowService.startCall(vars.call_type);
    });
    if (callType?.id) {
      this.store.dispatch(flowActions.SetFirstStepIdAction({id: callType.id}));
    }

    const searchNListLeads = FlowFactory.searchNListLeads(undefined, (flowService: FlowService, vars: any) => {
      flowService.updateCall({leadId: vars.lead});
    });
    const outboundType = FlowFactory.outboundType();
    const searchNListContacts = FlowFactory.searchNListContacts()
    const searchNListWebLeads = FlowFactory.searchNListWebLeads();
    const appointmentList = FlowFactory.appointmentList((flowService: FlowService, vars: any, step: any) => {
      // flowService.updateStepOptions(step.id, {query: {dealId: vars.deal, savedSearch: 'opp-events'}});
      step.state.options['query'] ={
        dealId: vars.deal,
        // savedSearch: 'opp-events'
      };

      return step;
    });

    const reasonForCall = FlowFactory.reasonForCall();

    const createLead = FlowFactory.createLead();
    const editLead = FlowFactory.editLead((flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    });
    const setLeadSource = FlowFactory.setLeadSource((flowService: FlowService, vars: any, step: any) => {
      step.state.data.id = vars.lead;
      return step;
    });
    const oppList = FlowFactory.opportunityList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        leadId: vars.lead
      };
      return step;
    });
    const toOppList = FlowFactory.link(editLead, oppList);
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

    const relationshipBuilding = FlowFactory.relationshipBuilding(undefined, (flowService: FlowService, vars: any, step: any) => {
      step.variables['appointment_action'] = 'set';
      return step;
    });
    const toRelationshipBuilding1 = FlowFactory.link(setLeadSource, relationshipBuilding);

    const powerQuestion = FlowFactory.powerQuestion();
    const toPowerQuestion = FlowFactory.link(relationshipBuilding, powerQuestion);


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
    const recap = FlowFactory.recap();

    const existingEvent_no = FlowFactory.condition('new_event', (vars: any) => {
      return vars['new_event'];
    }, {}, setAppointment.id);

    const existingEvent_yes = FlowFactory.condition('new_event', (vars: any) => {
      return !vars['new_event'];
    }, {
      id: ModuleTypes.EVENT
    }, reasonForCall.id);

    const eventRouter = FlowFactory.router('Event Exists', '', [existingEvent_yes, existingEvent_no]);
    const toeventRouter = FlowFactory.link(appointmentList, eventRouter);

    const toCancelReschedule = FlowFactory.link(reasonForCall, setAppointment);

    // inbound
    const inboundCond = FlowFactory.condition('Inbound', (vars: any) => {
      return vars['call_type'] === 'inbound';
    }, {}, searchNListLeads.id);

    const outboundCond = FlowFactory.condition('Outbound', (vars: any) => {
      return vars['call_type'] === 'outbound';
    }, {}, outboundType.id);

    const callTypeRouter = FlowFactory.router('Call Type', '', [inboundCond, outboundCond]);
    const toCallTypeRouter = FlowFactory.link(callType, callTypeRouter);

    const existingLead_yes = FlowFactory.condition('Lead Selected', (vars: any) => {
      return !vars['new_lead'];
    }, {
      leadId: ModuleTypes.LEAD
    }, editLead.id);

    const existingLead_no = FlowFactory.condition('Create Lead', (vars: any) => {
      return vars['new_lead'];
    }, {}, createLead.id);

    const searchNListLeadsRouter = FlowFactory.router('Lead Selected', '', [existingLead_yes, existingLead_no]);
    const toSearchNListLeadsRouter = FlowFactory.link(searchNListLeads, searchNListLeadsRouter);

    const existingDeal_no = FlowFactory.condition('Create Deal', (vars: any) => {
      return vars['new_deal'];
    }, {}, createOpp.id);

    const existingDeal_yes = FlowFactory.condition('Edit Deal', (vars: any) => {
      return !vars['new_deal'];
    }, {
      id: ModuleTypes.DEAL
    }, editOpp.id);

    const oppListRouter = FlowFactory.router('Opportunity Selected', '', [existingDeal_yes, existingDeal_no]);
    const toOppListRouter = FlowFactory.link(oppList, oppListRouter);

    const setLeadSourceLink = FlowFactory.link(createLead, setLeadSource);

    const toRelationshipBuilding2 = FlowFactory.link(createOpp, relationshipBuilding);

    const inboundSetApptLink = FlowFactory.link(relationshipBuilding, setAppointment);
    const inboundSetApptLink1 = FlowFactory.link(editOpp, appointmentList);

    // const appointListToSetAppointment = FlowFactory.link(appointmentList, reasonForCall);

    // outbound
    const oppWithNoOutcomes = FlowFactory.noOutcomeList();

    const contactOppsWithNoOutcomes = FlowFactory.noOutcomeList((flowService: FlowService, vars: any, step: any) => {
      step.state.options['query'] = {
        contactId: vars.contact
      };

      return step;
    });

    const outboundType_webLeads = FlowFactory.condition('Web Leads',(vars: any) => {
      return vars['outbound_type'] === 'web_leads';
    }, {}, oppWithNoOutcomes.id);

    const outboundType_contacts = FlowFactory.condition('Search Contacts', (vars: any) => {
      return vars['outbound_type'] === 'contacts';
    }, {}, searchNListContacts.id);

    const webLeadRouter = FlowFactory.router('Outbound Type', '', [outboundType_webLeads, outboundType_contacts]);
    const webLeadLink = FlowFactory.link(outboundType, webLeadRouter);

    const createContact = FlowFactory.createContact();

    // You''ll never actually get here because we dont' want people randomly creating contacts in flow this way.
    // the step has `createNew: false`
    const existingContact_no = FlowFactory.condition('New Contact',(vars: any) => {
      return vars['new_contact'];
    }, {}, createContact.id);

    const existingContact_yes = FlowFactory.condition('Existing Contact', (vars: any) => {
      return !vars['new_contact'];
    }, {}, contactOppsWithNoOutcomes.id);

    const contactRouter = FlowFactory.router('Contact Exists', '', [existingContact_yes, existingContact_no]);
    const contactLink = FlowFactory.link(searchNListContacts, contactRouter);

    // Outbound Web Lead Conditions and Routers
    const existingOpp_no = FlowFactory.condition('Create Opportunity', (vars: any) => {
      return vars['new_deal'];
    }, {}, createOpp.id);

    const existingOpp_yes = FlowFactory.condition('Set Appointment', (vars: any) => {
      return !vars['new_deal'];
    }, {}, setAppointment.id);

    const oppRouter = FlowFactory.router('Opportunity Exists', undefined, [existingOpp_yes, existingOpp_no]);

    const oppLink2 = FlowFactory.link(oppWithNoOutcomes, oppRouter);

    const apptLink = FlowFactory.link(setAppointment, recap);

    const toSetAppointment = FlowFactory.link(editOpp, setAppointment);

    const end = FlowFactory.end();
    const toInboundEnd = FlowFactory.link(recap, end);

    const toObjectionEnd = FlowFactory.link(objection, end);


    ///
    this.process
      .addStep(callType)
      .addLink(toCallTypeRouter)
      .addRouter(callTypeRouter)
      .addStep(searchNListLeads)
      .addStep(outboundType)
      .addStep(appointmentList)
    // .addLink(appointListToSetAppointment);

    // 'inbound'
    this.process
      .addRouter(searchNListLeadsRouter)
      .addLink(toSearchNListLeadsRouter)
      .addStep(oppList)
      .addLink(toOppList)
      .addStep(createLead)
      .addStep(editLead)
      .addStep(setLeadSource)
      .addLink(setLeadSourceLink)
      .addStep(relationshipBuilding)
      .addLink(toRelationshipBuilding1)
      .addLink(toRelationshipBuilding2)
      .addLink(inboundSetApptLink)
      .addLink(inboundSetApptLink1)
      .addStep(setAppointment)
      .addStep(powerQuestion)
      .addLink(toPowerQuestion)
      .addStep(reasonForCall)
      .addRouter(eventRouter)
      .addLink(toeventRouter)
      .addLink(toCancelReschedule)
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
      // .addStep(createOpp1)
      .addRouter(oppRouter)
      .addLink(oppLink2)
      .addLink(webLeadLink)
      .addRouter(contactRouter)
      .addLink(contactLink)

      .addStep(createContact)

      .addStep(oppWithNoOutcomes)
      .addStep(contactOppsWithNoOutcomes)
      // .addLink(setApptLink)
      // .addLink(setApptLink2)
      // .addLink(setApptLink3)
      // .addRouter(apptRouter)
      .addStep(recap)
      .addLink(apptLink)
    // .addLink(oppLink)

    // global

    this.process
      .addStep(objection)
      .addLink(toObjectionEnd);

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
