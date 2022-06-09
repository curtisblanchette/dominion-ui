import { FlowRouter, FlowStep, FlowHostDirective, FlowStepHistoryEntry } from './_core';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';

export interface IHistory {
  prevStepId: string;
  currentStepId: string;
  data: any;
}

@Injectable({ providedIn: 'root' })
export class FlowService {
  public cache: { [key: string]: any } = {};

  public builder: FlowBuilder;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>
  ) {
    this.builder = new FlowBuilder(this.store);
  }

  public async start(host: FlowHostDirective): Promise<any> {
    await this.builder.build();
    const firstStep: FlowStep = this.builder.process.steps[0];
    this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: firstStep, variables: [], valid: false }));
    return this.renderComponent(host, firstStep);
  }

  public async goTo(host: FlowHostDirective, id: string) {
    const step = this.builder.process.steps.find(x => x.id === id);
    await this.renderComponent(host, <FlowStep>step);
  }

  public async next(host: FlowHostDirective) {
    // find a link where the "from" is equal to "currentStep"
    const link = this.builder.process.links.find(link => link.from.id === this.builder.process.currentStep?.step?.id);

    let step: FlowStep | FlowRouter | undefined = link?.to;

    if (step) {

      if (step instanceof FlowRouter) {
        const init = <FlowRouter>step;
        step = await init.evaluate();
      }

      if(this.builder.process.currentStep?.step?.id) {
        const historyEntry: FlowStepHistoryEntry = {
          id: this.builder.process.currentStep?.step?.id,
          variables: this.builder.process.currentStep?.variables,
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
    const clone = [...this.builder.process.stepHistory];
    const previousStep = clone.pop();
    const step = this.builder.process.steps.find(step => step.id === previousStep?.id);
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
      let allVars = {...this.builder.process.currentStep?.variables, ...data};
      this.store.dispatch(flowActions.AddVariablesAction({payload: allVars}));
    }
  }

  public getCurrentStepData() {
    const clone = [...this.builder.process.stepHistory];
    if (clone.length) {
      const previousStepId = clone.pop()?.id;
      const stepFound = this.builder.process.steps.find(step => step.id == previousStepId);

      return stepFound?.data;
    }
    return null;
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

