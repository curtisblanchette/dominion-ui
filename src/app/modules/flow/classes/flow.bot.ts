import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { FlowStatus } from '../store/flow.reducer';
import * as fromApp from '../../../store/app.reducer';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType } from '../../../common/models';
import { ModuleTypes } from '../../../data/entity-metadata';
import { firstValueFrom, take } from 'rxjs';
import { FlowService } from '../flow.service';
import { Injectable } from '@angular/core';
import { BotAction, BotActionStatus } from './flow.botAction';
import * as flowActions from '../store/flow.actions';
import { FlowStep } from './flow.step';

/**
 * The FlowBot is capable of traversing a flow entirely as it was by a physical user.
 * It does this by calling "findNextStep()" just like  `FlowTimeline`  and `FlowService.next()`
 * FlowSteps cache all their interactions in state, including variables and any other state data.
 * This provides FlowBot with all the necessary information to traverse the flow from cache.
 */


@Injectable({providedIn: 'root'})
export class FlowBot {

  private readonly services: { [key: string]: EntityCollectionService<DominionType> };
  public botActions: BotAction[] = [];

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
      const [timeline, status] = result;

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
                const isCreate = step.state.options.state === 'create';
                const operation = isCreate ? 'add' : 'update';

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

                const botAction = new BotAction({
                  name: operation + '-' + step.state.module,
                  icon: 'fa-user',
                  module: step.state.module,
                  status: BotActionStatus.INITIAL
                });

                this.botActions.push(botAction);

                let filter: any = await firstValueFrom(service.filter$);
                if (filter['id']) {
                  payload['id'] = filter['id'];
                }

                if(step.state.data.payload) {
                  payload = { ...payload, ...step.state.data.payload };
                }

                try {
                  const response = await service[operation](payload).toPromise();
                  botAction.status = BotActionStatus.SUCCESS;

                  // the id's we get back should be saved to the process.
                  flowService.updateStep(step.id, {state: {data: {id: response?.id}}}, 'merge');

                  // set the entityCollection filter to target this record going forward
                  service.setFilter({id: response?.id});

                  // notify the client
                  botAction.message = `${this.getModuleName(step.state.module)} ${operation === 'add' ? 'Created' : 'Updated'}.`;
                } catch(e: any) {
                  botAction.status = BotActionStatus.FAILURE;
                  botAction.errorMessage = e.message;
                }


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
                    const botAction = new BotAction({
                      name: 'cancel-event',
                      icon: 'fa-calendar',
                      message: 'Cancel Event',
                      status: BotActionStatus.PENDING
                    });
                    this.botActions.push(botAction);

                    try {
                      // TODO outcomeId should be a retrieved value
                      await this.services['eventService'].update({
                        id: step.state.data.toCancel,
                        outcomeId: 2
                      }).toPromise();
                      botAction.status = BotActionStatus.SUCCESS;
                      botAction.message = 'Appointment Cancelled.'
                    } catch(e: any) {
                      botAction.status = BotActionStatus.FAILURE;
                      botAction.errorMessage = e.message;
                    }

                  }
                    break;
                  case 'reschedule':
                  case 'set': {
                    if (step.state.options.state === 'reschedule') {
                      const botAction = new BotAction({
                        name: 'reschedule-event',
                        icon: 'fa-calendar',
                        message: 'Reschedule Event',
                        status: BotActionStatus.PENDING
                      });
                      this.botActions.push(botAction);

                      try {
                        await this.services['eventService'].update({
                          id: step.state.data.toReschedule,
                          outcomeId: 1
                        }).toPromise();
                        botAction.status = BotActionStatus.SUCCESS;
                        botAction.message = 'Appointment Rescheduled.';
                        // TODO outcomeId should be a retrieved value
                        callOutcomeId = outcomes.find(o => o.label === 'Set Appointment')?.id;
                      } catch(e : any) {
                        botAction.status = BotActionStatus.FAILURE;
                        botAction.errorMessage = e.message;
                      }
                    } else {
                      // TODO outcomeId should be a retrieved value
                      callOutcomeId = outcomes.find(o => o.label === 'Rescheduled Appointment')?.id;
                    }

                    // Set Appointment
                    // depends on leadId
                    let leadFilter: any = await firstValueFrom(this.services['leadService'].filter$);
                    let contactFilter: any = await firstValueFrom(this.services['contactService'].filter$);

                    payload['leadId'] = leadFilter['id'];
                    payload['contactId'] = contactFilter['id'];

                    const botAction = new BotAction({
                      name: 'add-event',
                      icon: 'fa-calendar',
                      status: BotActionStatus.PENDING,
                      message: 'Creating Appointment'
                    });
                    this.botActions.push(botAction);

                    try {
                      const created = await this.services['eventService'].add(payload).toPromise();
                      flowService.updateStep(step.id, {state: {data: {id: created?.id}}}, 'merge');
                      this.services['eventService'].setFilter({id: created?.id});
                      botAction.status = BotActionStatus.SUCCESS;
                      botAction.message = 'Appointment Created.';
                    } catch(e: any) {
                      botAction.status = BotActionStatus.FAILURE;
                      botAction.errorMessage = e.message;
                    }

                  }
                }

                flowService.updateCall({statusId:callStatusId, outcomeId:callOutcomeId});
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

  private getModuleName(module: ModuleTypes) {
    if (module) {
      return module[0].toUpperCase() + module.substring(1, module.length);
    }
  }
}
