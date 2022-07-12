import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as flowActions from './flow.actions';
import { FlowCurrentStep, FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../index';
import { cloneDeep } from 'lodash';

export interface FlowState {
  processId: string | undefined;
  steps: FlowStep[] | any;
  routers: FlowRouter[] | any;
  links: FlowLink[] | any;
  currentStep: FlowCurrentStep | any | undefined;
  stepHistory: FlowStepHistoryEntry[];
  breadcrumbs: string[];
}

// need to serialize/deserialize the step/flow/router objects
const getInitialStateByKey = (key: string): any| (FlowStep|FlowRouter|FlowLink)[] | FlowCurrentStep | undefined => {
  let state = localStorage.getItem('state') || '';

  if (state) {
    const data: any = JSON.parse(state);
    // let items: (FlowStep|FlowLink|FlowRouter)[] = [];

    return setTimeout(() => {
      switch(key) {
        case 'steps': // @ts-ignore
          return data && data.flow.steps.map(step => (new FlowStep(step))) || [];
        case 'links': // @ts-ignore
          return data && data.flow.links.map(link => (new FlowLink(link))) || [];
        case 'routers': // @ts-ignore
          return data && data.flow.routers.map(router => (new FlowRouter(router))) || [];
        case 'currentStep': {
          // const { step, variables, valid } = data.flow.currentStep;
          return data.flow.currentStep;
        }
      }
    }, 0);
    // return items;
  }
}

export const initialState: FlowState = {
  processId: localStorage.getItem('processId') || undefined,
  steps: <FlowStep[]>getInitialStateByKey('steps') || [],
  routers: <FlowRouter[]>getInitialStateByKey('routers') || [],
  links: <FlowLink[]>getInitialStateByKey('links') || [],
  currentStep: <FlowCurrentStep>getInitialStateByKey('currentStep') || { step: undefined, variables: {}, valid: false },
  stepHistory: JSON.parse(localStorage.getItem('stepHistory') || '[]'),
  breadcrumbs: JSON.parse(localStorage.getItem('breadcrumbs') || '[]') || []
};

export const reducer = createReducer(
  initialState,

  on(flowActions.AddStepAction, (state, { payload }) => ({
    ...state,
    steps: [ ...state.steps, payload ]
  })),
  on(flowActions.AddLinkAction, (state, { payload }) => ({
    ...state,
    links: [ ...state.links, payload ]
  })),
  on(flowActions.AddRouterAction, (state, { payload }) => ({
    ...state,
    routers: [ ...state.routers, payload ]
  })),
  on(flowActions.UpdateCurrentStepAction, (state, { step, valid, variables }) => ({
    ...state,
    currentStep: {...state.currentStep, step, valid, variables },
    breadcrumbs: addToBreadcrumbs(state.breadcrumbs, step.id)
  })),

  on(flowActions.SetStepHistoryAction, (state, { payload }) => ({
    ...state,
    stepHistory: [ ...state.stepHistory, payload ]
  })),

  on(flowActions.GoToStepByIdAction, (state, { id }) => ({ ...state })),

  on(flowActions.ResetAction, (state) => ({
    ...state,
    steps: [],
    routers: [],
    links: [],
    currentStep: undefined,
    stepHistory: [],
    breadcrumbs: []
  })),

  on(flowActions.AddVariablesAction, (state, { payload }) => ({
    ...state,
    currentStep: {
      ...state.currentStep,
      variables: payload
    }
  })),

  on(flowActions.SetValidityAction, (state, { payload }) => ({
    ...state,
    currentStep: { ...state.currentStep, valid: payload  }
  })),

  on(flowActions.NextStepAction, (state, { stepId }) => ({...state}) ),

  on(flowActions.PrevStepAction, (state, { }) => ({
    ...state,
    breadcrumbs: [...state.breadcrumbs.slice(0, -1)]
  })),

  on(flowActions.SetProcessIdAction, (state, { processId }) => ({
    ...state,
    processId: processId
  }))
);

const addToBreadcrumbs = (breadcrumbs: string[], stepId: string | undefined) => {
  if (!stepId) {
    return breadcrumbs;
  }
  if(breadcrumbs[breadcrumbs.length - 1] === stepId) {
    return breadcrumbs;
  }
  return [...breadcrumbs, stepId];
}


export const selectFlow = createFeatureSelector<FlowState>('flow');

export const selectSteps = createSelector(selectFlow, (flow: FlowState) => flow.steps.map((step: any) => {
  // hack to get a mutable object back from store, "specifically the step.component"
  step = new FlowStep(cloneDeep(step));
  const deserialized = step._deserialize();
  return deserialized;

  // const clone = cloneDeep(step)
  // return clone._deserialize();
}));

export const selectRouters = createSelector(selectFlow, (flow: FlowState) => flow.routers.map((router: any) => {
  router = new FlowRouter(cloneDeep(router));
  const deserialized = router._deserialize();
  return deserialized;
  // const clone = cloneDeep(router);
  // return clone._deserialize()
}));
export const selectLinks = createSelector(selectFlow, (flow: FlowState) => flow.links.map((link: any) => {
  // return link;
  link = new FlowLink(cloneDeep(link));

  // link.to = JSON.parse(link.to);
  if(link.to.hasOwnProperty('conditions')){
    link.to = new FlowRouter(link.to)._deserialize();
  } else {
    link.to = new FlowStep(link.to)._deserialize();
  }
  link.from = new FlowStep(link.from)._deserialize();
  return link;
  // return clone._deserialize();
}));


export const selectCompletedSteps = createSelector(selectFlow, (flow: FlowState) => {
  // we'll use the breadcrumb trail here to gather the steps traversed
  return flow.breadcrumbs.map(stepId => {
    const step = flow.steps.find((step: any) => step.id === stepId);
    // return step;
    return new FlowStep(cloneDeep(step));
  });
});

export const selectFlowTimeline = createSelector(selectFlow, (flow: FlowState) => {

  const completed = flow.breadcrumbs.map(stepId => {
    const step = flow.steps.find((step: any) => step.id === stepId);
    // return step;
    return new FlowStep(cloneDeep(step));
  });

  const next: FlowStep[] = [];

  const getNextLink = (stepId: string | undefined): any => {
    const nextLink = flow.links.find((link: any) => stepId === link.from.id);

    if(nextLink && nextLink.to instanceof FlowStep ){
      next.push(nextLink.to);
      return getNextLink(nextLink.to.id);
    }

    return [...completed, ...next] as FlowStep[];
  }

  return getNextLink(flow?.currentStep?.step?.id);


});

export const selectProcessId     = createSelector(selectFlow, (flow: FlowState) => flow.processId);

export const selectCurrentStep   = createSelector(selectFlow, (flow: FlowState) => {
  if(!flow?.currentStep?.step) {
    return {};
  }
  if(!(flow?.currentStep?.step instanceof FlowStep)) {
    // @ts-ignore
    flow.currentStep.step = new FlowStep(cloneDeep(flow.currentStep.step));
  }
  return flow.currentStep;
});
export const selectCurrentStepId = createSelector(selectFlow, (flow: FlowState) => flow.currentStep?.step?.id);
export const selectIsValid       = createSelector(selectFlow, (flow: FlowState) => flow.currentStep?.valid);

export const selectStepHistory   = createSelector(selectFlow, (flow: FlowState) => flow.stepHistory);
export const selectAllVariables  = createSelector(selectFlow, (flow: FlowState) => accumulateVariables(flow.stepHistory));
// @ts-ignore
export const selectVariableByKey = (key: string) => createSelector(selectCurrentStep, selectAllVariables, (currentStep, variables:{[key: string]: string | number | Date }) => {
  const allVars = {...variables, ...currentStep?.variables};
  return allVars[key];
});

export const selectStepById       = (id: string) => createSelector(selectSteps, (entities: FlowStep[]) => entities.filter((item: FlowStep) => item.id === id).map((step: any) => step._deserialize() ));
export const selectRouterById     = (id: string) => createSelector(selectRouters, (entities: FlowRouter[]) => entities.filter((item: FlowRouter) => item.id === id).map((router: any) => router._deserialize()));
export const selectLinkById       = (id: string) => createSelector(selectLinks, (entities: FlowLink[]) => entities.find((item: FlowLink) =>  (<FlowStep | FlowRouter>item.to).id === id )?._deserialize());




/**
 * Used to get the current state of flow variables
 * aggregates from stepHistory state of the flows variables
 * while maintaining detailed change tracking
 * @param history
 */
export function accumulateVariables(history: FlowStepHistoryEntry[]): {[key: string]: string | number | Date } {
  let items: {[key:string]: any} = {};

  for(const [key, value] of Object.entries(history)) {
    items = {...items, ...value['variables']};
  }

  return items;
}
