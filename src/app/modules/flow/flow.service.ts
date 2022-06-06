import { FlowCondition, FlowLink, FlowRouter, FlowStep, ModuleType } from './_core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { FlowHostDirective } from './_core/classes/flow.host';

import * as flowSteps from './flow.steps';

export interface IHistory {
  prevStepId: string;
  currentStepId: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class FlowService {
  public cache: { [key: string]: any } = {};

  public steps: FlowStep[] = [];
  public routers: FlowRouter[] = [];
  public links: FlowLink[] = [];
  public currentStep: FlowStep;
  public stepHistory: any[] = [];
  public variables: { [key: string]: any };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>
  ) {

    this.store.select(fromFlow.selectFlow).subscribe(state => {
      this.steps = state.steps;
      this.routers = state.routers;
      this.links = state.links;
      this.currentStep = state.currentStep;
      this.stepHistory = state.stepHistory;
      this.variables = state.variables;
    });
  }



  public reset() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public create(type?: string) {


    const callType = flowSteps.callType();
    const inboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    },flowSteps.searchNListContacts());

    const outboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, flowSteps.webLeadsType());

    const callTypeRouter = new FlowRouter('Router', '', [inboundCond, outboundCond]);
    const callTypeLink = new FlowLink(callType, callTypeRouter);

    this
      .addStep(callType)
      .addRouter(callTypeRouter)
      .addStep(flowSteps.searchNListContacts())
      .addStep(flowSteps.webLeadsType())
      .addLink(callTypeLink);

    switch (type) {
      case 'inbound':
        this.createInbound();
        break;

      case 'outbound':
        this.createOutbound();
        break;

      default:
        this.createInbound();
        this.createOutbound();
        break;
    }

  }

  public createInbound() {

    const existingLead_yes = new FlowCondition(async () => {
      return await this.getVariable('existing_lead') === 'yes';
    }, flowSteps.selectExistingOpp());

    const existingLead_no = new FlowCondition(async () => {
      return await this.getVariable('existing_lead') === 'no';
    }, flowSteps.createNewLead());

    const searchNListContactsRouter = new FlowRouter('Router', '', [existingLead_yes, existingLead_no]);
    const searchNListContactsLink = new FlowLink(flowSteps.searchNListContacts(), searchNListContactsRouter);

    this
      .addRouter(searchNListContactsRouter)
      .addStep(flowSteps.selectExistingOpp())
      .addStep(flowSteps.createNewLead())
      .addLink(searchNListContactsLink)

  }

  public createOutbound() {

    const webLeads_yes = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, flowSteps.searchNListWebLeads());

    const webLeads_no = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, flowSteps.searchNListContacts());

    const webLeadRouter = new FlowRouter('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = new FlowLink(flowSteps.webLeadsType(), webLeadRouter);

    this
      .addRouter(webLeadRouter)
      .addStep(flowSteps.searchNListWebLeads())
      .addStep(flowSteps.searchNListContacts())
      .addLink(webLeadLink)

  }

  public start(host: FlowHostDirective): Promise<any> {
    this.create();
    const firstStep: FlowStep = this.steps[0];
    this.store.dispatch(flowActions.SetCurrentStepAction({payload: firstStep}));
    return this.renderComponent(host, firstStep);
  }

  public async goTo(host: FlowHostDirective, id: string) {
    const step = this.steps.find(x => x.id === id);
    await this.renderComponent(host, <FlowStep>step);
  }

  public async next(host: FlowHostDirective) {
    // find a link where the "from" is equal to "currentStep"
    const link = this.links.find(link => link.from.id === this.currentStep.id);

    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {

      if (step instanceof FlowRouter) {
        const init = <FlowRouter>step;
        step = await init.evaluate();
      }

      const clonedHistory = [...this.stepHistory];
      if (this.currentStep.id) {
        const history = {
          currentStepId: this.currentStep.id,
          prevStepId: null,
          data: null
        };
        clonedHistory.push(history);
      }

      this.store.dispatch(flowActions.SetStepHistoryAction({payload: clonedHistory}));
      await this.renderComponent(host, <FlowStep>step);


    } else {
      console.warn('No step found to transition to.');
    }
  }

  public async back(host: FlowHostDirective) {
    const clone = [...this.stepHistory];
    const previousStep = clone.pop();
    const step = this.steps.find(step => step.id === previousStep.currentStepId);
    // this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));
    // console.log('Back Step', step);
    if (step) {
      await this.renderComponent(host, <FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public addVariables(data: any) {
    if (data) {
      let allVars = {...this.variables, ...data};
      this.store.dispatch(flowActions.AddVariablesAction({payload: allVars}));
    }
  }

  public addToCache(module: ModuleType, data: any) {
    this.cache[module] = data;
  }

  public getFromCache(module: ModuleType) {
    return this.cache[module];
  }

  public getCurrentStepData() {
    const clone = [...this.stepHistory];
    if (clone.length) {
      const previousStep = clone.pop().currentStepId;
      const stepFound = this.stepHistory.find(step => step.currentStepId == previousStep);
      if (stepFound && stepFound.data) {
        return stepFound.data;
      }
    }
    return null;
  }

  public addStep(step: FlowStep) {
    // this.steps.push(step);
    this.store.dispatch(flowActions.AddStepAction({payload: step}));
    return this;
  }

  public addRouter(router: FlowRouter) {
    // this.routers.push(router);
    this.store.dispatch(flowActions.AddRouterAction({payload: router}));
    return this;
  }

  public addLink(link: FlowLink) {
    // this.links.push(link);
    this.store.dispatch(flowActions.AddLinkAction({payload: link}));
    return this;
  }

  public async renderComponent(host: FlowHostDirective, step: FlowStep) {
    if (await this.getVariable('existing_lead') === 'yes') {
      let record = await this.getVariable('existing_lead_record');
      step.data.options.parentId = record.id;
    }
    // this.currentStep = step;
    this.store.dispatch(flowActions.SetCurrentStepAction({payload: step}));

    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();


    const componentRef = viewContainerRef.createComponent<any>(step.component);
    componentRef.instance.state = step.data;
    return componentRef;
  }

  public async getVariable(key?: string) {
    if (key) {
      return await firstValueFrom(this.store.select(fromFlow.selectVariablesByKey(key)).pipe(take(1)));
    } else {
      return await firstValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
    }
  }

}

