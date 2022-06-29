import { FlowRouter, FlowStep, FlowHostDirective, FlowStepHistoryEntry, NoStepFoundError, FlowListComponent, FlowNode, FlowStepClassMap, FlowDataComponent } from './index';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';
import { FlowComponent } from './flow.component';
import { CustomDataService } from '../../data/custom.dataservice';
import { DominionType } from '../../common/models';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { ModuleTypes } from '../../data/entity-metadata';
import { FlowState } from './store/flow.reducer';

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
  public callService: CustomDataService<DominionType>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>,
    private dataServiceFactory: DefaultDataServiceFactory
  ) {
    this.builder = new FlowBuilder(this.store, this);
    this.callService = this.dataServiceFactory.create(ModuleTypes.CALL) as CustomDataService<DominionType>;

    // this.store.select(fromFlow.selectFlow).subscribe((flow: FlowState) => {
    //   console.log(flow);
    // });
  }

  public async restart(context: FlowHostDirective): Promise<any> {
    this.store.dispatch(flowActions.ResetAction());
    this.builder.reset();
    await this.start(context);
  }

  public async start(context: FlowHostDirective, resume = false): Promise<any> {

    if(!resume) {
      await this.builder.build();

      const firstStep: FlowStep = this.builder.process.steps[0];

      if (firstStep && firstStep.id) {
        this.store.dispatch(flowActions.NextStepAction({stepId: firstStep.id}));
        return this.renderComponent(context, firstStep);
      }
      throw new NoStepFoundError();
    }

    const currentStep: FlowStep = this.builder.process.currentStep?.step as FlowStep;
    return this.renderComponent(context, currentStep);

  }

  public async resume(context:FlowHostDirective): Promise<any> {

  }

  public startCall(direction: string): void {
    this.callService.add({
      startTime: new Date().toISOString(),
      direction: direction
    }, false).pipe(take(1)).subscribe((res) =>{
      this.addVariables({call_direction: direction})
    });
  }

  public updateCall(data: any): void {
    this.callService.update(data).pipe(take(1)).subscribe((res) => {
      const variables: any = {};
      for(const key of Object.keys(data)) {
         variables[`call_${key}`] = data[key];
      }
      this.addVariables(variables);
    });
  }

  public async goTo(context: FlowHostDirective, id: string) {
    const step = this.builder.process.steps.find(x => x.id === id);
    await this.renderComponent(context, <FlowStep>step);
  }

  public findNextStep(): FlowNode | undefined  {
    // find a link where the "from" is equal to "currentStep"
    const link = this.builder.process.links.find((link: any) => {
      return link.from.id === this.builder.process.currentStep?.step?.id
    });
    return <FlowStep|FlowRouter>link?.to;
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

      this.store.dispatch(flowActions.NextStepAction({stepId: step.id}));
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
      if(this.builder.process.currentStep.step.release) {
        this.builder.process.currentStep.step.release();
      }


      const historyEntry: FlowStepHistoryEntry = {
        id: this.builder.process.currentStep?.step?.id,
        variables: this.builder.process.currentStep?.variables,
        elapsed: this.builder.process.currentStep.step.elapsed
      } as FlowStepHistoryEntry;
      this.store.dispatch(flowActions.SetStepHistoryAction({payload: historyEntry}));
    }
  }

  public async renderComponent(host: FlowHostDirective, step: FlowStep): Promise<void> {
    this.store.dispatch(flowActions.UpdateCurrentStepAction({step: step, valid: false, variables: []}));

    const viewContainerRef = host.viewContainerRef;
    viewContainerRef.clear();

    try {

      const component = (<any>FlowStepClassMap)[step.component];
      this.cmpReference = viewContainerRef.createComponent(component);
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
          const variable = { [value.module as ModuleTypes]: value.record?.id || null };

          /**
           * If the select record has entity relationships ,
           * store them as entity variables
           */
          if( value.record?.contactId || value.record?.contacts ){
            variable[ModuleTypes.CONTACT] = value.record?.contactId || value.record?.contacts[0].id;
          }
          if( value.record?.leadId || value.record?.leads ){
            variable[ModuleTypes.LEAD] = value.record.leadId || value.record?.leads[0].id;
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

