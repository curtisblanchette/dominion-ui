import { FlowCondition, FlowConditionOperators, FlowLink, FlowRouter, FlowStep } from "./_core";
import { Injectable } from "@angular/core";
import { FlowComponentType } from "./_core/step-components";
import { ModuleType } from './_core/classes/flow.moduleTypes';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from "rxjs";
import * as flowSteps from './flow.steps';

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

  public create( type?:string ) {

    flowSteps.callType;    

    const inboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'inbound';
    }, flowSteps.searchNListContacts);

    const outboundCond = new FlowCondition(async () => {
      return await this.getVariable('call_type') === 'outbound';
    }, flowSteps.webLeadsType);

    const callTypeRouter = new FlowRouter( 'Router', '', [ inboundCond, outboundCond ] );
    const callTypeLink = new FlowLink( flowSteps.callType, callTypeRouter );

    this
      .addStep(flowSteps.callType)  
      .addRouter(callTypeRouter)
      .addStep(flowSteps.searchNListContacts)
      .addStep(flowSteps.webLeadsType)
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

  public createInbound(){ 

    const existingLead_yes = new FlowCondition(async () => {
      return await this.getVariable('existing_lead') === 'yes';
    }, flowSteps.selectExistingOpp);

    const existingLead_no = new FlowCondition(async () => {
      return await this.getVariable('existing_lead') === 'no';
    }, flowSteps.createNewLead);

    const searchNListContactsRouter = new FlowRouter( 'Router', '', [ existingLead_yes, existingLead_no ] );
    const searchNListContactsLink = new FlowLink( flowSteps.searchNListContacts, searchNListContactsRouter );

    this
        .addRouter(searchNListContactsRouter)
        .addStep(flowSteps.selectExistingOpp)
        .addStep(flowSteps.createNewLead)
        .addLink(searchNListContactsLink)

  }

  public createOutbound(){ 

    const webLeads_yes = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'web_leads';
    }, flowSteps.searchNListWebLeads);

    const webLeads_no = new FlowCondition(async () => {
      return await this.getVariable('web_lead_options') === 'contacts';
    }, flowSteps.searchNListContacts);

    const webLeadRouter = new FlowRouter( 'Router', '', [ webLeads_yes, webLeads_no ] );
    const webLeadLink = new FlowLink( flowSteps.webLeadsType, webLeadRouter );

    this
        .addRouter(webLeadRouter)
        .addStep(flowSteps.searchNListWebLeads)
        .addStep(flowSteps.searchNListContacts)
        .addLink(webLeadLink)
    

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
      this.addVariables(data);
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

  public addVariables( data:any ){
    if( data ){
      let allVars = { ...this.variables, ...data };
      this.store.dispatch(flowActions.AddVariablesAction({payload: allVars}));
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

  public async renderComponent(step: FlowStep) {
    if( await this.getVariable('existing_lead') === 'yes' ){
      let record = await this.getVariable('existing_lead_record');
      step.data.options.parentId = record.id;
    }    
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

