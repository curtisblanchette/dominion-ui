import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as flowActions from './flow.actions';
import { FlowCurrentStep, FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../_core';
import { cloneDeep } from 'lodash';

export interface FlowState {
  steps: FlowStep[]
  routers: FlowRouter[]
  links: FlowLink[],
  currentStep: FlowCurrentStep | undefined,
  stepHistory: FlowStepHistoryEntry[]
}

// need to serialize/deserialize the step/flow/router objects
function getInitialStateByKey(key: string): (FlowStep|FlowRouter|FlowLink)[] | FlowCurrentStep | undefined {
  let state = localStorage.getItem(key);

  if (state) {
    const data: any = JSON.parse(state);
    let items: (FlowStep|FlowLink|FlowRouter)[] = [];

    switch(key) {
      case 'steps': // @ts-ignore
        items.push(new FlowStep(...data)); break;
      case 'links': // @ts-ignore
        items.push(new FlowLink(...data)); break;
      case 'routers': // @ts-ignore
        items.push(new FlowRouter(...data)); break;
      case 'currentStep': {
        const { step, variables, valid } = data;

        return <FlowCurrentStep>{
          step: new FlowStep(step),
          variables,
          valid,
          serialize: ()=>{}
        };
      }
    }
    return items;
  }
}

export const initialState: FlowState = {
  steps: <FlowStep[]>getInitialStateByKey('steps') || [],
  routers: <FlowRouter[]>getInitialStateByKey('routers') || [],
  links: <FlowLink[]>getInitialStateByKey('links') || [],
  currentStep: getInitialStateByKey('currentStep') as FlowCurrentStep || { step: undefined, variables: {}, valid: false },
  stepHistory: JSON.parse(localStorage.getItem('stepHistory') || '[]'),
};

export const reducer = createReducer(
  initialState,
  on(flowActions.AddStepAction, (state, { payload }) => ({ ...state, steps: [ ...state.steps, payload ]})),
  on(flowActions.AddLinkAction, (state, { payload }) => ({ ...state, links: [ ...state.links, payload ]})),
  on(flowActions.AddRouterAction, (state, { payload }) => ({ ...state, routers: [ ...state.routers, payload ]})),
  on(flowActions.UpdateCurrentStepAction, (state, { step, valid, variables }) => ({ ...state, currentStep: { ...state.currentStep, step, valid, variables } })),
  on(flowActions.SetStepHistoryAction, (state, { payload }) => ({ ...state, stepHistory: [ ...state.stepHistory, payload ] })),
  on(flowActions.GoToStepByIdAction, (state, { id }) => ({ ...state })),
  on(flowActions.ResetAction, (state) => ({...state, steps: [], routers: [], links: [], currentStep: undefined})),
  on(flowActions.AddVariablesAction, (state, { payload }) => ({ ...state, currentStep: { ...state.currentStep, variables: payload }})),
  on(flowActions.SetValidityAction, (state, { payload }) => ({ ...state, currentStep: { ...state.currentStep, valid: payload  }})),
);

export const selectFlow = createFeatureSelector<FlowState>('flow');

export const selectSteps = createSelector(selectFlow, (flow: FlowState) => flow.steps.map(step => {
  // hack to get a mutable object back from store, "specifically the step.component"
  const clone = cloneDeep(step);
  return clone.serialize();
}));

export const selectRouters       = createSelector(selectFlow, (flow: FlowState) => flow.routers.map(router => router.serialize()));
export const selectLinks         = createSelector(selectFlow, (flow: FlowState) => flow.links.map(link => link.serialize()));
export const selectCurrentStep   = createSelector(selectFlow, (flow: FlowState) => flow.currentStep?.serialize ? flow.currentStep.serialize() : undefined);
export const selectIsValid       = createSelector(selectFlow, (flow: FlowState) => flow.currentStep?.valid);

export const selectStepHistory   = createSelector(selectFlow, (flow: FlowState) => flow.stepHistory);
export const selectAllVariables  = createSelector(selectFlow, (flow: FlowState) => accumulateVariables(flow.stepHistory));
// @ts-ignore
export const selectVariableByKey = (key: string) => createSelector(selectFlow, (flow: FlowState) =>  flow.currentStep?.variables[key]);

export const selectStepById       = (id: string) => createSelector(selectSteps, (entities: FlowStep[]) => entities.filter((item: FlowStep) => item.id === id));
export const selectRouterById     = (id: string) => createSelector(selectRouters, (entities: FlowRouter[]) => entities.filter((item: FlowRouter) => item.id === id));
export const selectLinkById       = (id: string) => createSelector(selectLinks, (entities: FlowLink[]) => entities.find((item: FlowLink) =>  item.to.id === id ));




/**
 * Used to get the current state of flow variables
 * aggregates from stepHistory state of the flows variables
 * while maintaining detailed change tracking
 * @param history
 */
function accumulateVariables(history: FlowStepHistoryEntry[]): {[key: string]: string | number | Date } {
  const items: {[key:string]: any} = {};

  for(const [key, value] of Object.entries(history)) {
    // @ts-ignore
    items[history[key].id] = value['variables'];
  }

  return items;
}
