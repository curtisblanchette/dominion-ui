import { createReducer, on } from '@ngrx/store';

import * as flowActions from './flow.actions';
import { FlowLink, FlowRouter, FlowStep } from '../_core';

export interface State {
  steps: FlowStep[] | null
  routers: FlowRouter[] | null
  links: FlowLink[] | null
}

// need to serialize/deserialize the step/flow/router objects
function getStepsState() {
  const steps = localStorage.getItem('steps');
  if (steps) {
    return steps || null;
  }
  return null;
}

function getLinksState(){
  const links = localStorage.getItem('links');
  if (links) {
    return links || null;
  }
  return null;
}

export const initialState: State = {
  steps: [], // getStepsState(),
  routers: [],
  links: []
};

export const reducer = createReducer(
  initialState,
  // on(flowActions.AddStepAction, (state, { payload }) => ([...state, ...payload])),

);

export const getSteps = (state:State) => state.steps;
export const getRouters = (state:State) => state.routers;
export const getLinks = (state:State) => state.links;