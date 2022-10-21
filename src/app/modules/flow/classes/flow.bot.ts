import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import * as flowActions from '../store/flow.actions';
import { FlowStatus } from '../store/flow.reducer';
import * as fromApp from '../../../store/app.reducer';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType } from '../../../common/models';
import { ModuleTypes } from '../../../data/entity-metadata';
import { firstValueFrom, lastValueFrom, take } from 'rxjs';
import { FlowService } from '../flow.service';
import { Injectable } from '@angular/core';
import { FlowBotAction, FlowBotActionStatus } from './flow.botAction';

import { FlowStep } from './flow.step';
import { v4 as uuidv4 } from "uuid";

/**
 * The FlowBot is capable of traversing a flow entirely as it was by a physical user.
 * It does this by calling "findNextStep()" just like  `FlowTimeline`  and `FlowService.next()`
 * FlowSteps cache all their interactions in state, including variables and any other state data.
 * This provides FlowBot with all the necessary information to traverse the flow from cache.
 */

@Injectable({providedIn: 'root'})
export class FlowBot {

  private id: string = uuidv4();

  private readonly services: { [key: string]: EntityCollectionService<DominionType> };
  public botActions: FlowBotAction[] = [];

  constructor(
    private store: Store<fromFlow.FlowState>,
    private appStore: Store<fromApp.AppState>,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory
  ) {

    this.services = {
      leadService: this.entityCollectionServiceFactory.create(ModuleTypes.LEAD),
      contactService: this.entityCollectionServiceFactory.create(ModuleTypes.CONTACT),
      dealService: this.entityCollectionServiceFactory.create(ModuleTypes.DEAL),
      eventService: this.entityCollectionServiceFactory.create(ModuleTypes.EVENT),
      addressService: this.entityCollectionServiceFactory.create(ModuleTypes.ADDRESS),
      campaignService: this.entityCollectionServiceFactory.create(ModuleTypes.CAMPAIGN),
      leadSourceService: this.entityCollectionServiceFactory.create(ModuleTypes.LEAD_SOURCE),
      officeService: this.entityCollectionServiceFactory.create(ModuleTypes.OFFICE),
      callsService: this.entityCollectionServiceFactory.create(ModuleTypes.CALL)
    }
  }
  public reset() {
    this.botActions = [];
  }

  public run(flowService: FlowService) {
    this.store.select(fromFlow.selectFlowBotContext).pipe(take(1)).subscribe(async (result: any) => {
      let [timeline, status, didObject] = result;
      let objectionId:any = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey('objectionId')).pipe(take(1)));
      
      // contains objection, filter out anything invalid
      timeline = didObject && timeline.filter((step: FlowStep) => step.valid) || timeline;

      if(!timeline.every((step: FlowStep) => step.valid)) {
        // TODO Should highlight the invalid steps in the sidemenu
        return;
      }

      if (status !== FlowStatus.SUCCESS) {

        this.store.dispatch(flowActions.UpdateFlowAction({ status: FlowStatus.PENDING }));
        const outcomes = await firstValueFrom(this.appStore.select(fromApp.selectLookupsByKey('callOutcome')));
        const callType = await firstValueFrom(this.appStore.select(fromApp.selectLookupsByKey('callType')));
        const eventOutcomes = await firstValueFrom(this.appStore.select(fromApp.selectLookupsByKey('eventOutcome')));
        const statuses = await firstValueFrom(this.appStore.select(fromApp.selectLookupsByKey('callStatus')));
        const leadStatus = await firstValueFrom(this.appStore.select(fromApp.selectLookupsByKey('leadStatus')));

        let eventActions:{ [key:string] : any } = {};
        const leadId = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey('lead')).pipe(take(1)));
        const dealId = await lastValueFrom(this.store.select(fromFlow.selectVariableByKey('deal')).pipe(take(1)));
        let callTypeId = callType.find( type => type.label === 'Sales')?.id;
        if( leadId && dealId ){
          callTypeId = callType.find( type => type.label === 'Existing Lead')?.id;
        }

        for (let step of timeline) {
          // clone the cached payload data from the step (it's immutable from store)
          let payload = {...step.state.data[step.state.module]};

          try {
            switch (step.component) {
              case 'FlowDataComponent': {
                const service = this.services[`${step.state.module}Service`];
                const operation = step.state.options.state === 'create' ? 'add' : 'update';

                // some FlowTextComponents need to perform updates on entities
                // we'll capture the extra entity payloads now
                const additions = timeline
                  .filter((step: FlowStep) => step.component === "FlowTextComponent" && step.state.data[step.state.module])
                  .map((x: FlowStep) => x.state.data[step.state.module])
                  .reduce((a: any, b: any) => {
                    return { ...a, ...b };
                  }, {});

                if(Object.keys(additions).length) {
                  payload = {...payload, ...additions};
                }

                let filter: any = await firstValueFrom(service.filter$);
                if (filter['id']) {
                  payload['id'] = filter['id'];
                }

                if(step.state.data.payload) {
                  payload = { ...payload, ...step.state.data.payload };
                }

                const action = new FlowBotAction(this.entityCollectionServiceFactory,{
                  name: operation + '-' + step.state.module,
                  icon: 'fa-user',
                  module: step.state.module,
                  operation,
                  payload
                });
                this.botActions.push(action);

                await action.execute().then(response => {
                  if(step.state.module === ModuleTypes.DEAL || step.state.module === ModuleTypes.LEAD) {
                    // update the call with the new lead / deal id
                    if(operation === 'add') {
                      this.store.dispatch(flowActions.UpdateStepAction({
                        id: step.id,
                        changes: {
                          variables: {
                            [step.state.module]: response.id
                          }
                        },
                        strategy: 'merge'
                      }));
                    }

                  }
                });

              }
                break;
              case 'FlowAppointmentComponent': {
                // TODO outcomeId should be a retrieved value;
                let callOutcomeId = outcomes.find(o => o.label === 'Cancelled Appointment')?.id;
                // TODO statusId should be a retrieved value;
                let callStatusId = statuses.find(o => o.label === 'Answered')?.id;

                switch (step.state.options.state) {
                  case 'cancel': {
                    const action = new FlowBotAction(this.entityCollectionServiceFactory, {
                      name: 'cancel-event',
                      icon: 'fa-calendar',
                      module: ModuleTypes.EVENT,
                      operation: 'update',
                      payload: {
                        id: step.state.data.toCancel,
                        outcomeId: eventOutcomes.find(o => o.label === 'Canceled')?.id
                      },
                      message: 'Cancel Event',
                    });
                    this.botActions.push(action);
                    await action.execute().then(() => action.message = 'Appointment Canceled.');
                  }
                  break;

                  case 'reschedule':
                  case 'set': {
                    if (step.state.options.state === 'reschedule') {
                      const action = new FlowBotAction(this.entityCollectionServiceFactory, {
                        name: 'reschedule-event',
                        icon: 'fa-calendar',
                        message: 'Reschedule Event',
                        module: ModuleTypes.EVENT,
                        operation: 'update',
                        payload: {
                          id: step.state.data.toReschedule,
                          outcomeId: eventOutcomes.find(o => o.label === 'Rescheduled')?.id
                        }
                      });
                      this.botActions.push(action);

                      try {
                        await action.execute().then(() => action.message = 'Appointment Rescheduled.');

                        callOutcomeId = outcomes.find(o => o.label === 'Set Appointment')?.id;
                      } catch(e : any) {
                        action.status = FlowBotActionStatus.FAILURE;
                        action.errorMessage = e.message;
                      }
                    } else {
                      callOutcomeId = outcomes.find(o => o.label === 'Rescheduled Appointment')?.id;
                    }

                    // Set Appointment
                    // depends on leadId
                    let leadFilter: any = await firstValueFrom(this.services['leadService'].filter$);
                    let contactFilter: any = await firstValueFrom(this.services['contactService'].filter$);

                    payload['leadId'] = leadFilter['id'];
                    payload['contactId'] = contactFilter['id'];

                    const action = new FlowBotAction(this.entityCollectionServiceFactory, {
                      name: 'add-event',
                      icon: 'fa-calendar',
                      module: ModuleTypes.EVENT,
                      operation: 'add',
                      payload,
                      message: 'Creating Appointment'
                    });
                    this.botActions.push(action);

                    await action.execute().then(() => action.message = 'Appointment Created');
                    eventActions = {
                      id : action.response?.id,
                      state : step.state.options.state
                    };
                    flowService.updateStep(step.id, {state: {data: {id: action.response?.id}}}, 'merge');
                  }
                }

                const moduleIds: any = this.botActions
                  .filter(action => action.operation === 'add') // anything newly created
                  .map(action => {
                        let data:{ [key:string] : any } = {};
                        data[action.module] = action.response.id;
                        if( ModuleTypes.EVENT == action.module ){
                          data['deal'] = action.response.dealId;
                        }
                        return data;
                      }
                    ) // return a key/value pair
                  .reduce((a, b) => ({...a, ...b}), {}); // merge results into singular object

                flowService.updateCall({
                  leadId: moduleIds.lead,
                  dealId: moduleIds.deal,
                  statusId: callStatusId,
                  outcomeId: callOutcomeId,
                  typeId: callTypeId
                });
              }
                break;
              case 'FlowTextComponent': {
                if (step.state.template === 'opp-follow-up') {
                   this.services[`${ModuleTypes.DEAL}Service`].update({id: step.state.data.id, scheduledCallBack: step.state.data.deal.scheduledCallBack })
                }
              }
                break;
            }

          } catch (e) {
            this.store.dispatch(flowActions.UpdateFlowAction({status: FlowStatus.FAILURE}));
            console.error(e);
          }
        }
        // Update the note record
        flowService.updateNote(await flowService.getNotesFromCache());
        // Update Call record
        flowService.updateCall({typeId: callTypeId});        

        this.store.dispatch(flowActions.UpdateFlowAction({status: FlowStatus.SUCCESS}));

        // Update the Call record if objected
        if( didObject ){
          /**
           * If Call was objected, set the the call outcome to No Set
           * Doesn't matter if the Appointment was set or not
           */          
          
          flowService.updateCall({
            outcomeId: outcomes.find(o => o.label === 'No Set')?.id,
            objectionId : objectionId
          });

          /**
           * If the call was objected after setting up of Appointment
           * Cancel the Event
           * Update lead status to No Set
           */
          
          if( eventActions ){
            let eventPayload = {
              outcomeId : eventOutcomes.find(o => o.label === 'Canceled')?.id
            };
            flowService.updateEvent(eventActions['id'], eventPayload);
            // Update lead status
            let getLeadId: any = await firstValueFrom(this.services['leadService'].filter$);
            flowService.updateLead(getLeadId['id'], {statusId : leadStatus.find(ls => ls.label === 'No Set')?.id });
          }
        }

      } // end status !== 'complete'

      // this.actions.push('All information for this call has been captured. Thank you!');
    });

    for (const key of Object.keys(this.services)) {
      this.services[key].clearCache();
      this.services[key].setFilter({});
    }


  }


}
