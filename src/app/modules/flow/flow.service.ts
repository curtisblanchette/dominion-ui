import { FlowRouter, FlowStep, FlowHostDirective, FlowStepHistoryEntry, NoStepFoundError, FlowDataComponent, FlowListComponent, FlowNode, ModuleType } from './index';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';
import { FlowComponent } from './flow.component';

export interface IHistory {
  prevStepId: string;
  currentStepId: string;
  data: any;
}

@Injectable({providedIn: 'root'})
export class FlowService {
  public cache: { [key: string]: any } = {};

  public builder: FlowBuilder;
  public cmpReference: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>
  ) {
    this.builder = new FlowBuilder(this.store);
  }

  public async start(context: FlowHostDirective): Promise<any> {
    await this.builder.build();
    const firstStep: FlowStep = this.builder.process.steps[0];
    if (firstStep && firstStep.id) {
      this.store.dispatch(flowActions.NextStepAction({host: context, stepId: firstStep.id}));
      return this.renderComponent(context, firstStep);
    }

    throw new NoStepFoundError();

  }

  public async goTo(context: FlowHostDirective, id: string) {
    const step = this.builder.process.steps.find(x => x.id === id);
    await this.renderComponent(context, <FlowStep>step);
  }

  public findNextStep(): FlowNode | undefined  {
    // find a link where the "from" is equal to "currentStep"
    const link = this.builder.process.links.find(link => link.from.id === this.builder.process.currentStep?.step?.id);
    return link?.to;
  }

  public async next(host: FlowHostDirective): Promise<any> {
    // find a link where the "from" is equal to "currentStep"
    let step = this.findNextStep();

    if (step instanceof FlowRouter) {
      const init = <FlowRouter>step;
      step = await init.evaluate();
    }

    if(typeof this.cmpReference.instance.onSave === 'function') {
        await this.cmpReference.instance.onSave();
    }

    if(typeof this.cmpReference.instance.onNext === 'function') {
      this.cmpReference.instance.onNext();
    }

    if (step?.id) {
      this.createHistoryEntry();

      this.store.dispatch(flowActions.NextStepAction({host, stepId: step.id}));
      return await this.renderComponent(host, <FlowStep>step);
    }

    // TODO THIS SHOULD ONLY FIRE IF THERE'S ACTUALLY NO STEP FOUND
    throw new NoStepFoundError(step?.id);

  }

  public async back(host: FlowHostDirective): Promise<void> {

    if(typeof this.cmpReference.instance.onBack === 'function') {
      this.cmpReference.instance.onBack();
    }

    const completedSteps = [...(await firstValueFrom(this.store.select(fromFlow.selectCompletedSteps)))];
    completedSteps.pop() // remove the current step
    const prevStep = completedSteps.pop(); // grab the last item from the array

    if (prevStep) {
      this.createHistoryEntry();
      this.store.dispatch(flowActions.PrevStepAction({host}));
      return await this.renderComponent(host, <FlowStep>prevStep);
    }

    throw new NoStepFoundError();

  }

  private createHistoryEntry(): void {
    if (this.builder.process.currentStep?.step?.id) {
      // releasing the step sets step._destroyedAt
      this.builder.process.currentStep.step.release();

      const historyEntry: FlowStepHistoryEntry = {
        id: this.builder.process.currentStep?.step?.id,
        variables: this.builder.process.currentStep?.variables,
        elapsed: this.builder.process.currentStep.step.elapsed
      } as FlowStepHistoryEntry;
      this.store.dispatch(flowActions.SetStepHistoryAction({payload: historyEntry}));
    }
  }

  public async renderComponent(host: FlowHostDirective, step: FlowStep): Promise<void> {
    this.store.dispatch(flowActions.UpdateCurrentStepAction({step, valid: false, variables: []}));

    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();

    try {
      this.cmpReference = viewContainerRef.createComponent<any>(step.component);
      this.cmpReference.instance.module = step.state.module;
      this.cmpReference.instance.data = step.state.data;
      this.cmpReference.instance.options = step.state.options;

      if(this.cmpReference.instance instanceof FlowListComponent) {
        /**
         * Subscribe to:
         * @param {values} EventEmitter
         * @param {onCreate} EventEmitter
         */
        this.cmpReference.instance.values.subscribe((value: any) => {
          const variable = { [value.module as ModuleType]: value.record?.id || null };

          /**
           * If the select record has entity relationships ,
           * store them as entity variables
           */
          if( value.record?.contactId ){
            variable[ModuleType.CONTACT] = value.record.contactId;
          }
          if( value.record?.leadId ){
            variable[ModuleType.LEAD] = value.record.leadId;
          }

          this.setValidity(!!value.record);
          this.addVariables(variable);
        });

        this.cmpReference.instance.onCreate.subscribe((val: boolean) => {
          const _injector = host.viewContainerRef.parentInjector;
          const _parent: FlowComponent = _injector.get<FlowComponent>(FlowComponent);
          _parent.animationIndex++;

          this.next(host).catch((err) => {
            if (err instanceof NoStepFoundError) {
              console.warn(err);
            }
          });

        });
      }
    } catch(e) {
      console.error(e);
      throw e;
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

