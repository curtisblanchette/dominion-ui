import { FlowRouter, FlowStep, FlowHostDirective, FlowStepHistoryEntry, NoStepFoundError, FlowListComponent, FlowNode, FlowStepClassMap } from './index';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom, Observable, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';
import { FlowComponent } from './flow.component';
import { CustomDataService } from '../../data/custom.dataservice';
import { DominionType } from '../../common/models';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { ModuleTypes } from '../../data/entity-metadata';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ICallNote } from '@4iiz/corev2';
import { UpdateStr } from '@ngrx/entity/src/models';
import { User } from '../login/models/user';
import * as fromLogin from '../login/store/login.reducer';
import { v4 as uuidv4 } from 'uuid';
import { FlowProcess } from './classes/flow.process';

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
  public callId: string | undefined;
  public noteId: string | undefined;
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
    this.noteId = undefined;
    this.callId = undefined;
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
    this.builder.process = new FlowProcess(this.store);
    const vars = await lastValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));

    if(vars['call']) {
      this.callId = <string>vars['call'];
      this.noteId = <string>vars['note'];
    }

    return this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: this.builder.process.currentStep?.step as FlowStep }));
  }

  public startCall(direction: string): void {
    this.callService.add({
      startTime: new Date().toISOString(),
      direction: direction
    }, false).pipe(take(1)).subscribe(async (res) =>{
      this.callId = res.id
      this.addVariables({call: this.callId});
      await this.createNote('');
    });
  }

  public updateCall(payload: any): void {
    let data = {
      id: this.callId,
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
    const note = await firstValueFrom(this.http.post(`${environment.dominion_api_url}/calls/${this.callId}/notes`, {
      content
    })) as ICallNote;
    this.noteId = note.id;
    this.addVariables({note: note.id});
    return note;
  }

  public async updateNote(content: string): Promise<ICallNote> {
    const note = await firstValueFrom(this.http.put(`${environment.dominion_api_url}/calls/${this.callId}/notes/${this.noteId}`, {
      content
    })) as ICallNote;

    return note;
  }

  public async goTo(id: string): Promise<void> {
    const step = this.builder.process.steps.find(x => x.id === id);
    if(step) {
      this.store.dispatch(flowActions.UpdateCurrentStepAction({ step: step }));
    }
  }

  public findNextStep(): FlowNode | FlowStep | FlowRouter | undefined {
    const link = this.builder.process.links.find((link: any) => {
      return link.from.id === this.builder.process.currentStep?.step?.id
    });
    return <FlowStep|FlowRouter>link?.to;
  }

  public async next(): Promise<void> {
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

        return this.store.dispatch(flowActions.NextStepAction({stepId: step.id}));
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

    if (prevStep?.id) {
      this.createHistoryEntry();
      return this.store.dispatch(flowActions.PrevStepAction({stepId: prevStep.id}));
    }

    throw new NoStepFoundError();

  }

  public createHistoryEntry(): void {
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
          this.setValidity(!!value.record);
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

  public removeVariable(key: string) {
    this.store.dispatch(flowActions.RemoveVariableAction({key}));
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

