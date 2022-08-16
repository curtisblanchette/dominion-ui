import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType } from '../../../common/models';
import { ModuleTypes } from '../../../data/entity-metadata';
import { firstValueFrom, take } from 'rxjs';
import { FlowService } from '../flow.service';
import { Injectable } from '@angular/core';
import { BotAction } from './flow.botAction';
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
  public actions: BotAction[] = [];

  constructor(
    private store: Store<fromFlow.FlowState>,
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
    this.actions = [];
  }

  public run(flowService: FlowService) {
    this.store.select(fromFlow.selectFlowBotContext).pipe(take(1)).subscribe(async (result: any) => {
      const [timeline, status] = result;

      if(!timeline.every((step: FlowStep) => step.valid)) {
        // TODO Should highlight the invalid steps in the sidemenu
        return;
      }

      this.store.dispatch(flowActions.UpdateFlowAction({ status: 'processing' }));

      if (status !== 'complete') {

        try {
          for (let step of timeline) {
            // clone the cached payload data from the step (it's immutable from store)
            let payload = {...step.state.data[step.state.module]};

            switch (step.component) {
              case 'FlowDataComponent': {
                const service = this.services[`${step.state.module}Service`];
                const isCreate = step.state.options.state === 'create';
                const operation = isCreate ? 'add' : 'update';

                const action = new BotAction({
                  name: operation + '-' + step.state.module,
                  icon: 'fa-user',
                  module: step.state.module,
                  status: 'pending'
                });

                this.actions.push(action);

                let filter: any = await firstValueFrom(service.filter$);
                if (filter['id']) {
                  payload['id'] = filter['id'];
                }

                if(step.state.data.payload) {
                  payload = { ...payload, ...step.state.data.payload };
                }

                const response = await service[operation](payload).toPromise();
                // the id's we get back should be saved to the process.
                flowService.updateStep(step.id, {state: {data: {id: response?.id}}}, 'merge');
                // set the entityCollection filter to target this record going forward
                service.setFilter({id: response?.id});
                // notify the client
                action.status = 'complete';
                action.message = `${this.getModuleName(step.state.module)} ${operation === 'add' ? 'Created' : 'Updated'}.`;
              }
                break;
              case 'FlowAppointmentComponent': {

                switch (step.state.options.state) {
                  case 'cancel': {
                    const action = new BotAction({
                      name: 'cancel-event',
                      icon: 'fa-calendar',
                      message: 'Cancel Event',
                      status: 'pending'
                    });
                    this.actions.push(action);
                    // TODO outcomeId should be a retrieved value
                    await this.services['eventService'].update({
                      id: step.state.data.toCancel,
                      outcomeId: 2
                    }).toPromise();
                    action.status = 'complete';
                    action.message = 'Appointment Cancelled.'
                  }
                    break;
                  case 'reschedule':
                  case 'set': {
                    if (step.state.options.state === 'reschedule') {
                      const action = new BotAction({
                        name: 'reschedule-event',
                        icon: 'fa-calendar',
                        message: 'Reschedule Event',
                        status: 'pending'
                      });
                      this.actions.push(action);
                      // TODO outcomeId should be a retrieved value
                      await this.services['eventService'].update({
                        id: step.state.data.toReschedule,
                        outcomeId: 1
                      }).toPromise();
                      action.status = 'complete';
                      action.message = 'Appointment Rescheduled.';
                    }

                    // Set Appointment
                    // depends on leadId
                    let leadFilter: any = await firstValueFrom(this.services['leadService'].filter$);
                    let contactFilter: any = await firstValueFrom(this.services['contactService'].filter$);

                    payload['leadId'] = leadFilter['id'];
                    payload['contactId'] = contactFilter['id'];

                    const action = new BotAction({
                      name: 'add-event',
                      icon: 'fa-calendar',
                      status: 'pending',
                      message: 'Creating Appointment'
                    });
                    this.actions.push(action);

                    const created = await this.services['eventService'].add(payload).toPromise();

                    flowService.updateStep(step.id, {state: {data: {id: created?.id}}}, 'merge');
                    this.services['eventService'].setFilter({id: created?.id});
                    action.status = 'complete';
                    action.message = 'Appointment Created.';

                  }
                }

              }
                break;
              case 'FlowTextComponent': {

              }
                break;
            }
          }

          this.store.dispatch(flowActions.UpdateFlowAction({status: 'complete'}));

        } catch (e) {
          console.error(e);
        }


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
