import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as flowActions from './flow.actions';
import { FlowLink, FlowRouter, FlowStep } from '../_core';

export interface FlowState {
  steps: FlowStep[]
  routers: FlowRouter[]
  links: FlowLink[],
  currentStep: FlowStep,
  stepHistory: string[]
}

// need to serialize/deserialize the step/flow/router objects
function getInitialStateByKey(key: string): FlowStep | FlowStep[] | FlowRouter[] | FlowLink[] | null {
  let state = localStorage.getItem(key);

  if (state) {
    const data = JSON.parse(state);
    const items = [];
    let classMap: { [key: string]: any } = {
      steps: FlowStep,
      links: FlowLink,
      routers: FlowRouter,
      currentStep: FlowStep
    };

    if(key == 'currentStep') {
      return new classMap[key](...data);
    } else {
      items.push(new classMap[key](...data));
    }

    return items;
  }
  return key === 'currentStep' ? <FlowStep>{serialize:()=>{}} : [];
}

export const initialState: FlowState = {
  steps: <FlowStep[]>getInitialStateByKey('steps'),
  routers: <FlowRouter[]>getInitialStateByKey('routers'),
  links: <FlowLink[]>getInitialStateByKey('links'),
  currentStep: <FlowStep>getInitialStateByKey('currentStep'),
  stepHistory: JSON.parse(localStorage.getItem('stepHistory') || '[]')
};

export const reducer = createReducer(
  initialState,
  on(flowActions.AddStepAction, (state, { payload }) => ({ ...state, steps: [ ...state.steps, payload ]})),
  on(flowActions.AddLinkAction, (state, { payload }) => ({ ...state, links: [ ...state.links, payload ]})),
  on(flowActions.AddRouterAction, (state, { payload }) => ({ ...state, routers: [ ...state.routers, payload ]})),
  on(flowActions.SetCurrentStepAction, (state, { payload }) => ({ ...state, currentStep: payload })),
  on(flowActions.SetStepHistoryAction, (state, { payload }) => ({ ...state, stepHistory: payload })),
  on(flowActions.GoToStepByIdAction, (state, { id }) => ({ ...state })),
  on(flowActions.ResetAction, (state) => ({...state, steps: [], routers: [], links: [], currentStep: <FlowStep>{serialize:()=>{}}}))
);

export const selectFlow = createFeatureSelector<FlowState>('flow');

export const selectSteps       = createSelector(selectFlow, (flow: FlowState) => flow.steps.map(step => step.serialize()));
export const selectRouters     = createSelector(selectFlow, (flow: FlowState) => flow.routers.map(router => router.serialize()));
export const selectLinks       = createSelector(selectFlow, (flow: FlowState) => flow.links.map(link => link.serialize()));
export const selectCurrentStep = createSelector(selectFlow, (flow: FlowState) => flow.currentStep.serialize());

export const selectStepById   = (id: string) => createSelector(selectSteps, (entities: FlowStep[]) => entities.filter((item: FlowStep) => item.id === id));
export const selectRouterById = (id: string) => createSelector(selectRouters, (entities: FlowRouter[]) => entities.filter((item: FlowRouter) => item.id === id));
export const selectLinkById   = (id: string) => createSelector(selectLinks, (entities: FlowLink[]) => entities.find((item: FlowLink) =>  item.to.id === id ));


