import { FlowCondition, FlowCurrentStep, FlowLink, FlowRouter, FlowStep, ModuleType } from './_core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { FlowHostDirective } from './_core/classes/flow.host';

import * as flowSteps from './flow.steps';
import { untilDestroyed } from '@ngneat/until-destroy';
import { FlowStepHistoryEntry } from './_core/classes/flow.stepHistory';

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
  public currentStep: FlowCurrentStep | undefined;
  public stepHistory: FlowStepHistoryEntry[];

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
    });
  }

  public reset() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public create(type?: string) {

    // select call type
    const callType = flowSteps.callType();
    const searchNListContacts =  flowSteps.searchNListContacts()
    const webLeadsType = flowSteps.webLeadsType();
    const searchNListWebLeads = flowSteps.searchNListWebLeads();
    const createNewLead = flowSteps.createNewLead();
    const selectExistingOpp = flowSteps.selectExistingOpp()

    const inboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    }, searchNListContacts);

    const outboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, webLeadsType);

    const callTypeRouter = new FlowRouter('Router', '', [inboundCond, outboundCond]);
    const callTypeLink = new FlowLink(callType, callTypeRouter);

    // inbound
    const existingLead_yes = new FlowCondition(async () => {
      return await this.getVariable('lead');
    }, selectExistingOpp);

    const existingLead_no = new FlowCondition(async () => {
      const lead = await this.getVariable('lead');
      return lead === null;
    }, createNewLead);

    const searchNListContactsRouter = new FlowRouter('Router', '', [existingLead_yes, existingLead_no]);
    const searchNListContactsLink = new FlowLink(searchNListContacts, searchNListContactsRouter);


    // outbound
    const webLeads_yes = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, searchNListWebLeads);

    const webLeads_no = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, searchNListContacts);

    const webLeadRouter = new FlowRouter('Router', '', [webLeads_yes, webLeads_no]);
    const webLeadLink = new FlowLink(webLeadsType, webLeadRouter);

    this
      .addStep(callType)
      .addRouter(callTypeRouter)
      .addStep(searchNListContacts)
      .addStep(webLeadsType)
      .addLink(callTypeLink);

    // switch (type) {
    //   case 'inbound':

        this
          .addRouter(searchNListContactsRouter)
          .addStep(selectExistingOpp)
          .addStep(createNewLead)
          .addLink(searchNListContactsLink)

      //   break;
      //
      // case 'outbound':

        this
          .addRouter(webLeadRouter)
          .addStep(searchNListWebLeads)
          .addStep(searchNListContacts)
          .addLink(webLeadLink)
    //     break;
    //
    // }

  }

  public start(host: FlowHostDirective): Promise<any> {
    this.create();
    const firstStep: FlowStep = this.steps[0];
    this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: firstStep, variables: [], valid: false }));
    return this.renderComponent(host, firstStep);
  }

  public async goTo(host: FlowHostDirective, id: string) {
    const step = this.steps.find(x => x.id === id);
    await this.renderComponent(host, <FlowStep>step);
  }

  public async next(host: FlowHostDirective) {
    // find a link where the "from" is equal to "currentStep"
    console.log('currentStep', this.currentStep);
    const link = this.links.find(link => link.from.id === this.currentStep?.step?.id);

    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {

      if (step instanceof FlowRouter) {
        const init = <FlowRouter>step;
        step = await init.evaluate();
      }

      if(this.currentStep?.step?.id) {
        const historyEntry: FlowStepHistoryEntry = {
          id: this.currentStep?.step?.id,
          variables: this.currentStep?.variables,
          elapsed: 0 // TODO hook this up to an interval
        };

        this.store.dispatch(flowActions.SetStepHistoryAction({payload: historyEntry}));
      }

      // set the initial state to false
      // this.addValidState(false); // Any form should be not valid by default
      await this.renderComponent(host, <FlowStep>step);

    } else {
      console.warn('No step found to transition to.');
    }
  }

  public async back(host: FlowHostDirective) {
    const clone = [...this.stepHistory];
    const previousStep = clone.pop();
    const step = this.steps.find(step => step.id === previousStep?.id);
    // this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));
    // console.log('Back Step', step);
    if (step) {
      await this.renderComponent(host, <FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public setValidity(value: boolean) {
    this.store.dispatch(flowActions.SetValidityAction({payload: value}));
  }

  public addVariables(data: any) {
    if (data) {
      let allVars = {...this.currentStep?.variables, ...data};
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
      const previousStepId = clone.pop()?.id;
      const stepFound = this.steps.find(step => step.id == previousStepId);

      return stepFound?.data;
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
    const existingLead = await this.getVariable('existing_lead');
    if (existingLead === 'yes') {
      // let record = await this.getVariable('existing_lead_record');
      // step.data.options.parentId = record.id;
    }
    // this.currentStep = step;
    this.store.dispatch(flowActions.UpdateCurrentStepAction({ step, valid: false, variables: []  }));

    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();


    const componentRef = viewContainerRef.createComponent<any>(step.component);
    componentRef.instance.data = step.data;
  }

  public async getVariable(key?: string) {
    let value;

    if (key) {
       value = await firstValueFrom(this.store.select(fromFlow.selectVariableByKey(key)).pipe(take(1)));
    } else {
      value = await firstValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
    }

    return value;
  }

}

