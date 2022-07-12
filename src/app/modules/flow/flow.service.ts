import { FlowRouter, FlowStep, FlowHostDirective, FlowStepHistoryEntry, NoStepFoundError, FlowListComponent, FlowNode, FlowStepClassMap } from './index';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, Observable, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';
import { FlowComponent } from './flow.component';
import { CustomDataService } from '../../data/custom.dataservice';
import { DominionType } from '../../common/models';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { ModuleTypes } from '../../data/entity-metadata';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ICall, ICallNote } from '@4iiz/corev2';
import { UpdateStr } from '@ngrx/entity/src/models';
import { User } from '../login/models/user';
import * as fromLogin from '../login/store/login.reducer';
import { v4 as uuidv4 } from 'uuid';

export interface IHistory {
  prevStepId: string;
  currentStepId: string;
  data: any;
}

@Injectable({providedIn: 'root'})
export class FlowService {
  public id: string = uuidv4();
  public cmpReference: any;
  public callService: CustomDataService<DominionType>;
  public currentCall: ICall | undefined;
  public note: ICallNote | undefined
  public user$: Observable<User | null>;
  public flowHost!: FlowHostDirective;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>,
    private dataServiceFactory: DefaultDataServiceFactory,
    private http: HttpClient,
    public builder: FlowBuilder,
  ) {
    this.callService = this.dataServiceFactory.create(ModuleTypes.CALL) as CustomDataService<DominionType>;
    this.user$ = this.store.select(fromLogin.selectUser);
  }

  public async restart(): Promise<any> {
    this.store.dispatch(flowActions.ResetAction());
    this.builder.reset();
    this.note = undefined;
    this.currentCall = undefined;
    await this.start();
  }

  public async start(resume = false): Promise<any> {
    if(resume) return this.resume();

    // we're starting a new guy
    await this.builder.build();
    const step: FlowStep = this.builder.process.steps[0];

    if (step && step.id) {
      return this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: step }));
    }
    throw new NoStepFoundError();
  }

  public async resume(): Promise<any> {
    // resuming from store
    return this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: this.builder.process.currentStep?.step as FlowStep }));
  }

  public startCall(direction: string): void {
    this.callService.add({
      startTime: new Date().toISOString(),
      direction: direction
    }, false).pipe(take(1)).subscribe((res) =>{
      this.currentCall = res;
    });
  }

  public updateCall(payload: any): void {
    let data = {
      id: this.currentCall?.id,
      changes: payload
    }
    this.callService.update( <UpdateStr<any>>data, false).pipe(take(1)).subscribe((res) => {
      const variables: any = {};
      for(const key of Object.keys(res)) {
         variables[`call_${key}`] = res[key];
      }
      this.addVariables(variables);
    });
  }

  public async createNote(content: string): Promise<ICallNote>  {
    const note = await firstValueFrom(this.http.post(`${environment.dominion_api_url}/calls/${this.currentCall?.id}/notes`, {
      content
    })) as ICallNote;
    this.note = note;

    return note;
  }

  public async updateNote(content: string): Promise<ICallNote> {
    const note = await firstValueFrom(this.http.put(`${environment.dominion_api_url}/calls/${this.currentCall?.id}/notes/${this.note?.id}`, {
      content
    })) as ICallNote;
    this.note = note;

    return note;
  }

  public async goTo(id: string) {
    const step = this.builder.process.steps.find(x => x.id === id);
    await this.renderComponent(<FlowStep>step);
  }

  public findNextStep(): FlowNode | FlowStep | FlowRouter | undefined {
    const link = this.builder.process.links.find((link: any) => {
      return link.from.id === this.builder.process.currentStep?.step?.id
    });
    return <FlowStep|FlowRouter>link?.to;
  }

  public async next(): Promise<any> {
    // find a link where the "from" is equal to "currentStep"
    let step = this.findNextStep();

    try{
      if (step instanceof FlowRouter) {
        const init: FlowRouter = step;
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
        return await this.renderComponent(<FlowStep>step);
      }

    } catch(e) {
      console.error(e);
      throw new NoStepFoundError(step?.id);
    }


  }

  public async back(): Promise<void> {

    if(typeof this.cmpReference.instance.onBack === 'function') {
      this.cmpReference.instance.onBack();
    }

    const completedSteps = [...(await firstValueFrom(this.store.select(fromFlow.selectCompletedSteps)))];
    completedSteps.pop() // remove the current step
    const prevStep = completedSteps.pop(); // grab the last item from the array

    if (prevStep) {
      this.createHistoryEntry();
      this.store.dispatch(flowActions.PrevStepAction({host: this.flowHost}));
      return await this.renderComponent(<FlowStep>prevStep);
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

  public async renderComponent(step: FlowStep): Promise<void> {
    const viewContainerRef = this.flowHost.viewContainerRef;
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
          let variable:{ [key:string] : string } = {};

          if( value.record?.id ){
            variable[value.module as ModuleTypes] = value.record?.id;
          }

          /**
           * If the select record has entity relationships ,
           * store them as entity variables
           * if there are multiple contacts, we're only showing the first one.
           * TODO make multiple contacts/leads work
           */
          if( value.record?.contactId || ( value.record?.contacts && value.record?.contacts.length ) ){
            variable[ModuleTypes.CONTACT] = value.record?.contactId || value.record?.contacts[0]?.id;
          }
          if( value.record?.leadId || ( value.record?.leads && value.record?.leads.length ) ){
            variable[ModuleTypes.LEAD] = value.record.leadId || value.record?.leads[0]?.id;
          }

          this.setValidity(!!value.record);
          if( Object.keys(variable).length ){
            this.addVariables(variable);
          }
        });

        this.cmpReference.instance.onCreate.subscribe((val: boolean) => {
          const _injector = this.flowHost.viewContainerRef.parentInjector;
          const _parent: FlowComponent = _injector.get<FlowComponent>(FlowComponent);
          _parent.animationIndex++;

          this.next().catch((err) => {
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

