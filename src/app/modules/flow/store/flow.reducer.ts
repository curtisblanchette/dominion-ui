import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep } from '../index';
import { cloneDeep, get, merge } from 'lodash';
import * as flowActions from './flow.actions';

export enum FlowStatus {
  INITIAL = 'initial',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure'
}

export interface FlowState {
  processId: string | undefined;
  steps: FlowStep[] | any;
  routers: FlowRouter[] | any;
  links: FlowLink[] | any;
  currentStepId: string | undefined;
  firstStepId: string | undefined;
  lastStepId: string | undefined;
  status: FlowStatus;
  notes: string | undefined;
}

const getInitialStateByKey = (key: string): any | (FlowStep | FlowRouter | FlowLink)[] | undefined => {
  let state = localStorage.getItem('state') || '';

  if (state) {
    const data: any = JSON.parse(state);

    return setTimeout(() => {
      switch (key) {
        case 'flow.steps': // @ts-ignore
          return data && data.flow.steps.map(step => (new FlowStep(step))) || [];
        case 'flow.links': // @ts-ignore
          return data && data.flow.links.map(link => (new FlowLink(link))) || [];
        case 'flow.routers': // @ts-ignore
          return data && data.flow.routers.map(router => (new FlowRouter(router))) || [];
        case 'flow.currentStep': {
          // const { step, variables, valid } = data.flow.currentStep;
          return data.flow.currentStep;
        }
      }

      // Lodash _.get enables dot.notation objects queries
      const value = get(state, key);
      if (value) {
        return value;
      }
    }, 0);

  }
}

export const initialState: FlowState = {
  processId: getInitialStateByKey('flow.processId') || undefined,
  steps: <FlowStep[]>getInitialStateByKey('flow.steps') || [],
  routers: <FlowRouter[]>getInitialStateByKey('flow.routers') || [],
  links: <FlowLink[]>getInitialStateByKey('flow.links') || [],
  currentStepId: getInitialStateByKey('flow.currentStepId') || undefined,
  firstStepId: undefined,
  lastStepId: undefined,
  status: getInitialStateByKey('flow.status') || 'default',
  notes: undefined
};

export const reducer = createReducer(
  initialState,

  on(flowActions.UpdateFlowAction,(state, { firstStepId, currentStepId, lastStepId, processId, status }) => {
    state = {...state};
    firstStepId ? state.firstStepId = firstStepId : false;
    lastStepId ? state.lastStepId = lastStepId : false;
    processId ? state.processId = processId : false;
    currentStepId ? state.currentStepId = currentStepId : false;
    status ? state.status = status : false;
    return state
  }),

  on(flowActions.AddStepAction, (state, {payload}) => ({
    ...state,
    steps: [...state.steps, payload]
  })),

  on(flowActions.AddLinkAction, (state, {payload}) => ({
    ...state,
    links: [...state.links, payload]
  })),

  on(flowActions.AddRouterAction, (state, {payload}) => ({
    ...state,
    routers: [...state.routers, payload]
  })),

  on(flowActions.UpdateStepAction, (state, {id, changes, strategy}) => {
    if (id) {
      const found = state.steps.find((step: FlowStep) => step.id === id);
      const index = state.steps.indexOf(found);
      let clone = cloneDeep(found);

      switch(strategy) {
        case 'merge': {
          clone = merge(clone, changes);
        }
        break;
        case 'overwrite': {
          for(let key of Object.keys(changes)){
            clone[key] = (<any>changes)[key];
          }
        }
        break;
      }

      // replace steps
      let filteredSteps = state.steps.filter((step: any) => step.id !== id);
      filteredSteps.splice(index, 0, clone);
      return {...state, steps: filteredSteps};
    }
    return state;

  }),

  on(flowActions.GoToStepByIdAction, (state, {id}) => ({...state})),

  on(flowActions.ResetAction, (state) => ({
    ...state,
    steps: [],
    routers: [],
    links: [],
    processId: undefined,
    currentStepId: undefined,
    notes: undefined
  })),

  on(flowActions.NextStepAction, (state, {stepId}) => ({...state})),

  on(flowActions.PrevStepAction, (state, {}) => ({
    ...state
  })),

  on(flowActions.ClearAction, (state) => ({
    ...state,
    processId: undefined,
    steps: [],
    routers: [],
    links: [],
    currentStepId: undefined
  })),

  on(flowActions.addNotesAction, (state, {notes}) => ({
    ...state,
    notes: notes
  }))
);

export const getObjectByDeepKey = (obj: any): any => {
  let result = null;
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      result = getObjectByDeepKey(obj[i]);
      if (result) {
        break;
      }
    }
  } else {
    for (let prop in obj) {
      console.log(prop + ': ' + obj[prop]);
      if (prop == 'id') {
        if (obj[prop] == 1) {
          return obj;
        }
      }
      if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
        result = getObjectByDeepKey(obj[prop]);
        if (result) {
          break;
        }
      }
    }
  }
  return result;
}

export const selectFlow = createFeatureSelector<FlowState>('flow');

export const selectProcessId     = createSelector(selectFlow, (flow: FlowState) => flow.processId);
export const selectFirstStepId   = createSelector(selectFlow, (flow: FlowState) => flow.firstStepId);
export const selectLastStepId    = createSelector(selectFlow, (flow: FlowState) => flow.lastStepId);
export const selectCurrentStepId = createSelector(selectFlow, (flow: FlowState) => flow.currentStepId);
export const selectAllVariables  = createSelector(selectFlow, (flow: FlowState) => accumulateVariables(flow.steps));
export const selectNotes         = createSelector(selectFlow, (flow: FlowState) => flow.notes);


export const selectSteps   = createSelector(selectFlow, (flow: FlowState) => flow.steps.map((step: any) => new FlowStep(step)));
export const selectRouters = createSelector(selectFlow, (flow: FlowState) => flow.routers.map((router: any) => new FlowRouter(router)));
export const selectLinks   = createSelector(selectFlow, (flow: FlowState) => flow.links.map((link: any) => new FlowLink(link)));

export const selectStepById   = (id: string) => createSelector(selectSteps, (steps: FlowStep[]) => steps.filter((item: FlowStep) => item.id === id));
export const selectRouterById = (id: string) => createSelector(selectRouters, (routers: FlowRouter[]) => routers.filter((item: FlowRouter) => item.id === id));
export const selectLinkById   = (id: string) => createSelector(selectLinks, (links: FlowLink[]) => links.find(item => item.to === id));



export const selectFlowTimeline = createSelector(selectSteps, selectLinks, selectRouters, selectAllVariables, selectFirstStepId, (steps, links, routers, variables, firstStepId) => {
  if(steps?.length && links?.length && routers?.length) {
    const firstStep = steps.find((step: any) => step.id === firstStepId);
    const timeline: FlowStep[] = [firstStep];

    const _findNextStep = (stepId: string | undefined): any => {
      const nextLink = links.find((link: any) => link.from === stepId );
      const nextStep = steps.find((step: FlowStep) => step.id === nextLink?.to);
      const nextRouter = routers.find((router: FlowRouter) => router.id === nextLink?.to);

      if (nextStep instanceof FlowStep) {
        timeline.push(nextStep);
        return _findNextStep(nextStep.id);
      }

      if (nextRouter instanceof FlowRouter) {
        const router = routers.find((router: FlowRouter) => router.id === nextRouter?.id);
        const nextStepId = router.evaluate(variables);
        if (nextStepId) {
          let step = steps.find((step: any) => step.id === nextStepId);
          timeline.push(step);
          return _findNextStep(step.id);
        }

      }
      return timeline as FlowStep[];
    }

    return _findNextStep(firstStepId);
  }

});
export const selectFlowStatus = createSelector(selectFlow, (flow: FlowState) => flow.status);
export const selectFlowBotContext = createSelector(selectFlowTimeline, selectFlowStatus, (timeline, status) => {
  return [timeline, status];
});

export const selectIsValid = createSelector(selectSteps, selectCurrentStepId, (steps: FlowStep[], currentStepId) => {
  if(currentStepId) {
    const found = steps.find((step: any) => step.id === currentStepId);
    if(found) {
      return found.valid;
    }
  }
  return false;
});

export const selectIsLastStep = createSelector(selectCurrentStepId, selectLastStepId, (currentStepId, lastStepId) => {
  return currentStepId === lastStepId;
});

export const selectVariableByKey = (key: string) => createSelector(selectAllVariables, (variables: { [key: string]: any }) => {
  return variables[key];
});

export function accumulateVariables(steps: FlowStep[]): { [key: string]: string | number | Date } {
  let items: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(steps)) {
    items = {...items, ...value['variables']};
  }

  return items;
}

