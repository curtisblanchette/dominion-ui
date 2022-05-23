import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./_core";
import { Injectable } from "@angular/core";
import { FlowComponentType } from "./_core/step-components";
import { ModuleType } from './_core/classes/flow.moduleTypes';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { first, firstValueFrom, lastValueFrom, map, take } from "rxjs";
import { tap } from "lodash";

export interface IHistory {
  prevStepId:string;
  currentStepId:string;
  data:any;
}

@Injectable()
export class FlowService {
  public cache: { [key: string]: any } = {};

  public steps: FlowStep[];
  public routers: FlowRouter[];
  public links: FlowLink[];
  public currentStep: FlowStep;
  public stepHistory: any[];
  public variables: { [ key:string ] : any };

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

  get _currentStep() {
    return this.currentStep;
  }

  public reset() {
    this.store.dispatch(flowActions.ResetAction());
  }

  public create() {

    const callType = new FlowStep({
      nodeText : 'Call Type',
      nodeIcon : 'address-book',
      component : FlowComponentType.TEXT,
      data : {
        title : 'How you wanna proceed',
        body : 'select any one call type',
        template : 'call-type'
      }
    });    

    const existingLead = new FlowStep({
        nodeText: 'Existing Lead',
        nodeIcon: 'address-book',
        component: FlowComponentType.LIST,
        data: {
          title: 'Search Leads',
          module: ModuleType.LEAD,
          options: {
            searchable: true,
            editable: false,
            perPage: 25,
            columns: []
          },
          editPath: {
            route: ['/flow/f', {outlets: {'aux': ['edit']}}],
            extras: {
              state: {
                module: module,
              }
            }
          }
        }
    });

    const newLead = new FlowStep({
        nodeText: 'New Lead',
        nodeIcon: 'address-book',
        component: FlowComponentType.DATA,
        data: {
          title: 'Create a New Lead',
          firstName: 'Curtis',
          lastName: 'Blanchette',
          phone: '+12507183166',
          email: 'curtis@4iiz.com',
          module: ModuleType.LEAD
        }
    });

    const selectedCallType = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    }, existingLead);

    const selectedCallType1 = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, newLead);

    const callTypeRouter = new FlowRouter( 'Router', '', [ selectedCallType1, selectedCallType ] );
    const _callTypeLink = new FlowLink( callType, callTypeRouter );
    const callTypeLink = new FlowLink(existingLead, callTypeRouter);
    const callTypeLink1 = new FlowLink(newLead, callTypeRouter);

    // const appointment = new FlowStep({
    //   nodeText: 'Set Appointment',
    //   nodeIcon: 'calendar',
    //   component: FlowComponentType.EVENT,
    //   data: {
    //     title : 'Set an Appointment',
    //     module: ModuleType.EVENT
    //   }
    // });

    // const leadSelected = new FlowCondition(() => {
    //   return this.cache[ModuleType.EVENT]
    // }, appointment);

    // const leadNotSelected = new FlowCondition(() => {
    //   return !this.cache[ModuleType.LEAD]
    // }, newLead);

    // const existingLeadRouter = new FlowRouter('Router 1', '',[leadSelected, leadNotSelected]);

    // const leadSearch_to_existingLeadRouter = new FlowLink(existingLead, existingLeadRouter);

    this
        .addStep(callType)
        .addRouter(callTypeRouter)
        .addStep(existingLead)
        .addStep(newLead)
        .addLink(_callTypeLink)
  }

  public start(): Promise<any> {
    this.create();
    const firstStep: FlowStep = this.steps[0];
    this.store.dispatch(flowActions.SetCurrentStepAction({ payload: firstStep }));
    return this.renderComponent(firstStep);
  }

  public async goTo(id: string) {
    const step = this.steps.find(x => x.id === id);
    await this.renderComponent(<FlowStep>step);
  }

  public async next( data?:any ) {
    // find a link where the "from" is equal to "currentStep"
    const link = this.links.find(link => link.from.id === this.currentStep.id);

    let step: FlowStep | FlowRouter | undefined = link?.to;

    if( data ){
      let allVars = { ...this.variables, ...data };
      this.store.dispatch(flowActions.AddVariablesAction({payload: allVars}));
    }

    if (step) {

      if (step instanceof FlowRouter) {
        const init = <FlowRouter>step;
        step = await init.evaluate();        
      }

      const clone = [...this.stepHistory];      
      if(this.currentStep.id) {
        const history = {
          currentStepId : this.currentStep.id,
          prevStepId : null,
          data : data || null
        };
        clone.push(history);
      }
      
      this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));

      await this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public async back() {
    const clone = [...this.stepHistory];
    const previousStep = clone.pop();
    const step = this.steps.find(step => step.id === previousStep.currentStepId);
    // this.store.dispatch(flowActions.SetStepHistoryAction({payload: clone}));
    // console.log('Back Step', step);
    if(step)  {
      await this.renderComponent(<FlowStep>step);
    } else {
      console.warn('No step found to transition to.');
    }
  }

  public addToCache(module: ModuleType, data: any) {
    this.cache[module] = data;
  }

  public getFromCache(module: ModuleType) {
    return this.cache[module];
  }

  public getCurrentStepData(){
    const clone = [...this.stepHistory];
    if( clone.length ){
      const previousStep = clone.pop().currentStepId;
      const stepFound = this.stepHistory.find( step => step.currentStepId == previousStep );
      if( stepFound && stepFound.data ){
        return stepFound.data;
      }
    }
    return null;
  }

  public addStep(step: FlowStep) {
    this.store.dispatch(flowActions.AddStepAction({ payload: step }));
    return this;
  }

  public addRouter(router: FlowRouter) {
    this.store.dispatch(flowActions.AddRouterAction({ payload: router }));
    return this;
  }

  public addLink(link: FlowLink) {
    this.store.dispatch(flowActions.AddLinkAction({ payload: link }));
    return this;
  }

  public renderComponent(step: FlowStep) {
    this.store.dispatch(flowActions.SetCurrentStepAction({ payload: step }));

    return this.router.navigate(['/flow/f', {outlets: {'aux': [`${step.component}`]}}], {
      state: step.data
    });
  }

  public async getVariable( key?:string ) {
    if( key ){
      return await firstValueFrom(this.store.select(fromFlow.selectVariablesByKey(key)).pipe(take(1)));
    } else {
      return await firstValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));
    }
  }

}

