import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import * as flowActions from '../store/flow.actions';
import { FlowStatus } from '../store/flow.reducer';
import * as fromApp from '../../../store/app.reducer';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType } from '../../../common/models';
import { ModuleTypes } from '../../../data/entity-metadata';
import { firstValueFrom, take } from 'rxjs';
import { FlowService } from '../flow.service';
import { Injectable } from '@angular/core';
import { FlowBotAction, FlowBotActionStatus } from './flow.botAction';

import { FlowStep } from './flow.step';
import { v4 as uuidv4 } from "uuid";
import { DropdownItem } from '../../../common/components/ui/forms';

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
    console.log('id', this.id);
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

      // contains objection, filter out anything invalid
      timeline = didObject && timeline.filter((step: FlowStep) => step.valid) || timeline;

      if(!timeline.every((step: FlowStep) => step.valid)) {
        // TODO Should highlight the invalid steps in the sidemenu
        return;
      }

      if (status !== FlowStatus.SUCCESS) {

        this.store.dispatch(flowActions.UpdateFlowAction({ status: FlowStatus.PENDING }));

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

                console.log(additions);

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
                    // this.store.dispatch(flowActions.UpdateStepAction({
                    //   id: step.id,
                    //   changes: {
                    //     variables: {
                    //       [step.state.module]: response.id
                    //     }
                    //   },
                    //   strategy: 'merge'
                    // }));
                  }
                });

              }
                break;
              case 'FlowAppointmentComponent': {
                const outcomes = await firstValueFrom(this.appStore.select(fromApp.selectLookupByKey('callOutcome')));
                const statuses = await firstValueFrom(this.appStore.select(fromApp.selectLookupByKey('callStatus')));

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
                        outcomeId: outcomes.find((o: DropdownItem) => o.label === 'Cancel Appointment')
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
                          outcomeId: 1
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
                    flowService.updateStep(step.id, {state: {data: {id: action.response?.id}}}, 'merge');
                  }
                }

                const moduleIds: any = this.botActions
                  .filter(action => action.operation === 'add') // anything newly created
                  .map(action => ({ [action.module]: action.response?.id })) // return a key/value pair
                  .reduce((a, b) => ({...a, ...b})); // merge results into singular object

                flowService.updateCall({
                  leadId: moduleIds.lead,
                  dealId: moduleIds.deal,
                  statusId: callStatusId,
                  outcomeId: callOutcomeId
                });
              }
                break;
              case 'FlowTextComponent': {


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
        this.store.dispatch(flowActions.UpdateFlowAction({status: FlowStatus.SUCCESS}));

      } // end status !== 'complete'

      // this.actions.push('All information for this call has been captured. Thank you!');
    });

    for (const key of Object.keys(this.services)) {
      this.services[key].clearCache();
      this.services[key].setFilter({});
    }


  }


}
