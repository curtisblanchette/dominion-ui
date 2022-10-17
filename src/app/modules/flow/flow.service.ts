import { FlowListComponent, FlowRouter, FlowStep, FlowStepClassMap, FlowTextComponent, NoStepFoundError } from './index';
import { Injectable, Renderer2, RendererFactory2, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from './store/flow.reducer';
import { FlowStatus } from './store/flow.reducer';
import * as flowActions from './store/flow.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, lastValueFrom, map, Observable, Subscription, take } from 'rxjs';
import { FlowBuilder } from './flow.builder';
import { FlowComponent } from './flow.component';
import { CustomDataService } from '../../data/custom.dataservice';
import { DominionType } from '../../common/models';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { LookupTypes, ModuleTypes } from '../../data/entity-metadata';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ICallNote } from '@4iiz/corev2';
import { UpdateStr } from '@ngrx/entity/src/models';
import { User } from '../login/models/user';
import * as fromApp from '../../store/app.reducer';
import * as fromLogin from '../login/store/login.reducer';
import { v4 as uuidv4 } from 'uuid';
import { distinctUntilChanged } from 'rxjs/operators';
import { DropdownItem } from '../../common/components/interfaces/dropdownitem.interface';

export interface IHistory {
  prevStepId: string;
  currentStepId: string;
  data: any;
}

@Injectable({providedIn: 'root'})
export class FlowService {
  public id: string = uuidv4();
  public cmpReference: any;
  public flowHost: { viewContainerRef: ViewContainerRef };

  public callId: string | undefined;
  public noteId: string | undefined;

  public user$: Observable<User | null>;
  public variables$: Subscription;
  public callTypes$: Observable<DropdownItem[]>;

  public callService: CustomDataService<DominionType>;

  private leadService: EntityCollectionService<DominionType>;
  private contactService: EntityCollectionService<DominionType>;
  private dealService: EntityCollectionService<DominionType>;
  private eventService: EntityCollectionService<DominionType>;
  private addressService: EntityCollectionService<DominionType>;
  private campaignService: EntityCollectionService<DominionType>;
  private leadSourceService: EntityCollectionService<DominionType>;
  private officeService: EntityCollectionService<DominionType>;
  private callsService: EntityCollectionService<DominionType>;

  private renderer: Renderer2;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromFlow.FlowState>,
    private rendererFactory: RendererFactory2,
    private dataServiceFactory: DefaultDataServiceFactory,
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    private http: HttpClient,
    public builder: FlowBuilder,
    private appStore: Store<fromApp.AppState>,
  ) {
    console.log('FlowService Id: ', this.id);
    this.renderer = rendererFactory.createRenderer(null, null);

    this.callService = this.dataServiceFactory.create(ModuleTypes.CALL) as CustomDataService<DominionType>;

    // Use the collection services to clear all entity caches after the call ends.
    this.leadService       = this.entityCollectionServiceFactory.create(ModuleTypes.LEAD);
    this.contactService    = this.entityCollectionServiceFactory.create(ModuleTypes.CONTACT);
    this.dealService       = this.entityCollectionServiceFactory.create(ModuleTypes.DEAL);
    this.eventService      = this.entityCollectionServiceFactory.create(ModuleTypes.EVENT);
    this.addressService    = this.entityCollectionServiceFactory.create(ModuleTypes.ADDRESS);
    this.campaignService   = this.entityCollectionServiceFactory.create(ModuleTypes.CAMPAIGN);
    this.leadSourceService = this.entityCollectionServiceFactory.create(ModuleTypes.LEAD_SOURCE);
    this.officeService     = this.entityCollectionServiceFactory.create(ModuleTypes.OFFICE);
    this.callsService      = this.entityCollectionServiceFactory.create(ModuleTypes.CALL);

    this.user$ = this.store.select(fromLogin.selectUser);
    this.callTypes$ = this.store.select(fromApp.selectLookupsByKey('callType'));

    // update the Call IMMEDIATELY after specific variables are set.
    this.store.select(fromFlow.selectVariablesByKeys(['lead', 'deal', 'call_typeId', 'call_statusId', 'call_outcomeId'])).pipe(
      distinctUntilChanged((prev, curr) => {
        return (
          prev['lead'] === curr['lead'] &&
          prev['deal'] === curr['deal'] &&
          prev['call_typeId'] === curr['call_typeId'] &&
          prev['call_statusId'] === curr['call_statusId'] &&
          prev['call_outcomeId'] === curr['call_outcomeId']
        );
      }),
      map((vars: any) => {
        if (this.callId) {
          let payload: { [key: string]: any } = {}
          payload['leadId'] = vars.lead;
          payload['dealId'] = vars.deal;
          payload['typeId'] = vars.call_typeId;
          payload['outcomeId'] = vars.call_outcomeId;
          payload['statusId'] = vars.call_statusId;

          // removing anything undefined from the payload
          Object.entries(payload).map((elm) => {
            if (elm[1] == undefined) {
              delete payload[elm[0]];
            }
          });

          this.updateCall(payload)
        }
      })
    ).subscribe();

  }

  public async restart(): Promise<any> {
    this.store.dispatch(flowActions.ResetAction());
    this.noteId = undefined;
    this.callId = undefined;

    this.clearEntityCache();

    await this.start();
  }

  public clearEntityCache(){
    
    this.leadService.clearCache();
    this.leadService.setFilter({});

    this.contactService.clearCache();
    this.contactService.setFilter({});

    this.dealService.clearCache();
    this.dealService.setFilter({});

    this.eventService.clearCache();
    this.eventService.setFilter({});

    this.addressService.clearCache();
    this.addressService.setFilter({});

    this.campaignService.clearCache();
    this.campaignService.setFilter({});

    this.leadSourceService.clearCache();
    this.leadSourceService.setFilter({});

    this.officeService.clearCache();
    this.officeService.setFilter({});

    this.callsService.clearCache();
    this.callsService.setFilter({});
  }

  public async start(resume = false): Promise<any> {
    if (resume) return this.resume();

    // we're starting a new process
    this.store.dispatch(flowActions.UpdateFlowAction({processId: uuidv4(), status: FlowStatus.INITIAL}));
    await this.builder.build();
    const step: FlowStep = this.builder.process.steps[0];

    if (step && step.id) {
      return this.store.dispatch(flowActions.UpdateFlowAction({currentStepId: step.id}));
    }
    throw new NoStepFoundError();
  }

  public async resume(): Promise<any> {
    // resuming from store
    // when a user navigates to the DataModule, from Flow, during a call
    // the entityCollectionService filters will be mutated during Data interactions
    // the filters must be reset to the Flow selections upon resuming.
    const vars = await lastValueFrom(this.store.select(fromFlow.selectAllVariables).pipe(take(1)));

    for(const module of Object.values(ModuleTypes)) {
      // there should be no filter or cached records
      if(vars[`new_${module}`]) {
        (<any>this[`${module}Service`]).clearCache();
        (<any>this[`${module}Service`]).setFilter({});
      }
    }

    if (vars['lead']) {
      this.leadService.setFilter({id: vars['lead']});
    }

    if (vars['contact']) {
      this.contactService.setFilter({id: vars['contact']});
    }

    if (vars['deal']) {
      this.dealService.setFilter({id: vars['deal']});
    }

    if (vars['event']) {
      this.eventService.setFilter({id: vars['event']});
    }

    if (vars['call']) {
      this.callsService.setFilter({id: vars['call']});
      this.callId = <string>vars['call'];
      this.noteId = <string>vars['note'];
    }

    return this.store.dispatch(flowActions.UpdateFlowAction({currentStepId: this.builder.process.currentStepId}));
  }

  public async startCall(direction: string): Promise<void> {
    if (!this.callId) {
      this.callService.add({
        startTime: new Date().toISOString(),
        direction: direction
      }, false).pipe(take(1)).subscribe(async (res) => {
        this.callId = res.id;
        this.store.dispatch(flowActions.UpdateFlowAction({callId: this.callId}));
        this.updateStep(this.builder.process.currentStepId, {variables: {call: this.callId}});
        await this.createNote('');
      });
    } else {
      this.updateCall({
        direction: direction
      });
    }

  }

  public updateCall(payload: any): void {
    let data = {
      id: this.callId,
      changes: payload
    }
    this.callService.update(<UpdateStr<any>>data, false).pipe(take(1)).subscribe();
  }

  public async createNote(content: string): Promise<ICallNote> {
    const note = await firstValueFrom(this.http.post(`${environment.dominion_api_url}/calls/${this.callId}/notes`, {
      content
    })) as ICallNote;
    this.noteId = note.id;
    this.addVariables({note: note.id});
    return note;
  }

  public updateNote(content: string): Observable<ICallNote> {
    return this.http.put(`${environment.dominion_api_url}/calls/${this.callId}/notes/${this.noteId}`, {content}).pipe(take(1)).subscribe() as unknown as Observable<ICallNote>;
  }

  public updateNotesToCache(notes: string) {
    this.store.dispatch(flowActions.addNotesAction({notes}));
  }

  public async getNotesFromCache() {
    const notes = await firstValueFrom(this.store.select(fromFlow.selectNotes));
    return notes ? notes : '';
  }

  public async goTo(id: string): Promise<void> {
    this.store.dispatch(flowActions.UpdateFlowAction({currentStepId: id}));
  }

  public findNextStep(): FlowStep | FlowRouter | undefined {
    if (this.builder.process && this.builder.process.links) {
      const link = this.builder.process.links.find((link: any) => {
        return link.from === this.builder.process.currentStepId
      });

      const step = this.builder.process.steps.find(step => step.id === link?.to);

      if (step) {
        return step;
      }

      const router = this.builder.process.routers.find(router => router.id === link?.to);
      if (router) {
        return router;
      }
      // return <FlowStep | FlowRouter>link?.to;
    }
  }

  public async next(): Promise<void> {
    // traverse the flow path for the next step
    let step = this.findNextStep();
    let router: FlowRouter;
    let routerResponse;

    try {
      // test if next FlowNode is FlowRouter instance
      if (step instanceof FlowRouter) {
        router = step as FlowRouter;
        routerResponse = await router.evaluate(this.builder.process.variables);
      }

      if (typeof this.cmpReference.instance.onSave === 'function') {
        await this.cmpReference.instance.onSave();
      }

      if (typeof this.cmpReference.instance.onNext === 'function') {
        this.cmpReference.instance.onNext();
      }

      if (step?.id) {
        this.createHistoryEntry();

        return this.store.dispatch(flowActions.NextStepAction({stepId: routerResponse || step.id}));
      }

    } catch (e) {
      console.error(e);
      throw new NoStepFoundError(step?.id);
    }


  }

  public async back(): Promise<void> {

    if (typeof this.cmpReference.instance.onBack === 'function') {
      this.cmpReference.instance.onBack();
    }

    const timeline = [...(await firstValueFrom(this.store.select(fromFlow.selectTimeline)))];
    const currentStepIndex = timeline.indexOf(timeline.find(step => step.id === this.cmpReference.instance.flowStepId));
    const prevStep = timeline[currentStepIndex - 1];

    if (prevStep?.id) {
      this.createHistoryEntry();
      return this.store.dispatch(flowActions.PrevStepAction({stepId: prevStep.id}));
    }

    throw new NoStepFoundError();

  }

  public createHistoryEntry(): void {
    // if (this.builder.process.currentStepId) {
    //   // releasing the step sets step._destroyedAt
    //   if(this.builder.process.currentStep.release) {
    //     this.store.dispatch(flowActions.UpdateCurrentStepAction())
    //     this.builder.process.currentStep.release();
    //   }
    //
    //   const historyEntry: FlowStepHistoryEntry = {
    //     id: this.builder.process.currentStepId,
    //     // variables: this.builder.process.currentStepVariables,
    //     elapsed: this.builder.process.currentStep.elapsed
    //   } as FlowStepHistoryEntry;
    //   this.store.dispatch(flowActions.SetStepHistoryAction({payload: historyEntry}));
    // }
  }

  public isLastStep(type = 'next'): boolean {
    if ('next' == type) {
      const next = this.findNextStep();
      if (next instanceof FlowStep && next.component === 'FlowTextComponent') {
        return next.state.data.lastStep;
      }
    }
    return false;
  }

  public async renderComponent(stepId: string): Promise<void> {
    const viewContainerRef = this.flowHost.viewContainerRef;
    viewContainerRef.clear();

    try {

      const step = this.builder.process.steps.find(step => step.id === stepId) as FlowStep;
      const component = (<any>FlowStepClassMap)[step.component];
      this.cmpReference = viewContainerRef.createComponent(component);
      this.cmpReference.instance.module = step.state.module;
      this.cmpReference.instance.data = step.state.data;
      this.cmpReference.instance.options = step.state.options;

      if (this.cmpReference.instance instanceof FlowListComponent) {
        /**
         * Subscribe to:
         * @param {values} EventEmitter
         * @param {onCreate} EventEmitter
         */

        this.cmpReference.instance.values.subscribe((value: any) => {

        });
        // FlowListComponents need to animate forward "onCreate"
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

    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public addVariables(data: any, id?: string): void {
    this.store.dispatch(flowActions.UpdateStepAction({
      id: id || this.builder.process.currentStepId,
      changes: {variables: data},
      strategy: 'merge'
    }));
  }

  public updateStep(stepId: string | undefined, changes: Partial<FlowStep>, strategy: 'merge' | 'overwrite' = 'merge') {
    this.store.dispatch(flowActions.UpdateStepAction({id: stepId, changes, strategy}))
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

  public getCurrentStepData(moduleType: ModuleTypes) {
    const currentStepId = this.builder.process.currentStepId;
    const currentStep = this.builder.process.steps.find(step => step?.id === currentStepId);
    return currentStep?.state.data[moduleType];
  }

  public aggregateDataForModule(module: ModuleTypes) {
    let data = {};
    this.builder.process.steps.map((step: FlowStep) => {
      if (step.state?.module === module && step.state?.data[module]) {
        data = {...data, ...step?.state?.data[module]};
      }
    });
    return data;
  }

  public getLookupByLabel(lookup: LookupTypes | string, label:string): Promise<DropdownItem | undefined> {
    return firstValueFrom(this.appStore.select(fromApp.selectLookupByLabel(lookup, label)));
  }

}

