import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { FlowLink, FlowRouter, FlowStep, FlowStepHistoryEntry } from '../index';
import { cloneDeep, get, merge } from 'lodash';
import * as flowActions from './flow.actions';
import { immerOn } from 'ngrx-immer/store';

export interface FlowState {
  processId: string | undefined;
  steps: FlowStep[] | any;
  routers: FlowRouter[] | any;
  links: FlowLink[] | any;
  currentStepId: string | undefined;
  firstStepId: string | undefined;
  stepHistory: FlowStepHistoryEntry[];
  breadcrumbs: string[]
}

const getInitialStateByKey = (key: string): any | (FlowStep | FlowRouter | FlowLink)[] | undefined => {
  let state = localStorage.getItem('state') || '';

  if (state) {
    const data: any = JSON.parse(state);
    // let items: (FlowStep|FlowLink|FlowRouter)[] = [];

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
  stepHistory: getInitialStateByKey('flow.stepHistory') || [],
  breadcrumbs: getInitialStateByKey('flow.breadcrumbs') || []
};

export const reducer = createReducer(
  initialState,

  on(flowActions.AddStepAction, (state, {payload}) => ({
    ...state,
    steps: [...state.steps, payload]
  })),
  on(flowActions.SetFirstStepIdAction, (state, {id}) => ({
    ...state,
    firstStepId: id
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
          clone = merge(clone, changes)
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
  // immerOn(flowActions.UpdateStepAction, (state, {id, changes}) => {
  //   if (id) {
  //     state.steps.map((step: any) => {
  //       if(step.id === id) {
  //         return merge(step, changes);
  //       }
  //     });
  //   }
  //   return state;
  // }),
  immerOn(flowActions.UpdateStepOptionsAction, (state, {id, options}) => {
    if (id) {
      const index = state.steps.indexOf(state.steps.find((step: any) => step.id === id));
      state.steps[index].state.options = {...state.steps[index].state.options, ...options};
    }
    return state;
  }),
  immerOn(flowActions.UpdateStepValidityAction, (state, {id, valid}) => {
    if (id) {
      const index = state.steps.indexOf(state.steps.find((step: any) => step.id === id));
      try {
        state.steps[index].valid = valid;
      } catch(e) {
        console.error(e);
      }
    }
    return state;
  }),
  immerOn(flowActions.UpdateStepVariablesAction, (state, {id, variables}) => {
    let step = state.steps.find((step: any) => step.id === id);
    if (step) {
      try {
        step.variables = {...step.variables, ...variables};
      } catch(e) {
        console.error(e);
      }
    }
    return state;
  }),
  on(flowActions.UpdateCurrentStepIdAction, (state, {id}) => ({
    ...state,
    currentStepId: id,
    // breadcrumbs: (!fromTimeline || (fromTimeline && !isBackAction)) && addToBreadcrumbs(state.breadcrumbs, step.id) || state.breadcrumbs
  })),

  on(flowActions.SetStepHistoryAction, (state, {payload}) => ({
    ...state,
    stepHistory: [...state.stepHistory, payload]
  })),

  on(flowActions.GoToStepByIdAction, (state, {id}) => ({...state})),

  on(flowActions.ResetAction, (state) => ({
    ...state,
    steps: [],
    routers: [],
    links: [],
    processId: undefined,
    currentStep: undefined,
    stepHistory: [],
    breadcrumbs: []
  })),

  // on(flowActions.AddVariablesAction, (state, { payload }) => ({
  //   ...state,
  //   currentStepVariables: payload
  // })),

  // on(flowActions.SetValidityAction, (state, {payload}) => ({
  //   ...state,
  //   currentStepValid: payload
  // })),

  on(flowActions.NextStepAction, (state, {stepId}) => ({...state})),

  on(flowActions.PrevStepAction, (state, {}) => ({
    ...state,
    breadcrumbs: [...state.breadcrumbs.slice(0, -1)]
  })),

  on(flowActions.SetProcessIdAction, (state, {processId}) => ({
    ...state,
    processId: processId
  })),

  on(flowActions.ClearAction, (state) => ({
    ...state,
    processId: undefined,
    steps: [],
    routers: [],
    links: [],
    currentStep: undefined,
    breadcrumbs: []
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

const addToBreadcrumbs = (breadcrumbs: string[], stepId: string | undefined) => {
  if (!stepId) {
    return breadcrumbs;
  }
  if (breadcrumbs[breadcrumbs.length - 1] === stepId) {
    return breadcrumbs;
  }
  return [...breadcrumbs, stepId];
}


export const selectFlow = createFeatureSelector<FlowState>('flow');

export const selectFirstStepId = createSelector(selectFlow, (flow: FlowState) => flow.firstStepId);

export const selectSteps = createSelector(selectFlow, (flow: FlowState) => flow.steps.map((step: any) => {
  // hack to get a mutable object back from store, "specifically the step.component"
  step = new FlowStep(cloneDeep(step));
  const deserialized = step._deserialize();
  return deserialized;
}));

export const selectRouters = createSelector(selectFlow, (flow: FlowState) => flow.routers.map((router: any) => {
  router = new FlowRouter(cloneDeep(router));
  const deserialized = router._deserialize();
  return deserialized;
}));
export const selectLinks = createSelector(selectFlow, (flow: FlowState) => flow.links.map((link: any) => {
  // return link;
  link = new FlowLink(cloneDeep(link));

  // link.to = JSON.parse(link.to);
  if (link.to.hasOwnProperty('conditions')) {
    link.to = new FlowRouter(link.to)._deserialize();
  } else {
    link.to = new FlowStep(link.to)._deserialize();
  }
  link.from = new FlowStep(link.from)._deserialize();
  return link;
  // return clone._deserialize();
}));

export const selectBreadcrumbs = createSelector(selectFlow, (flow: FlowState) => {
  return flow.breadcrumbs;
});

export const selectCompletedSteps = createSelector(selectFlow, (flow: FlowState) => {
  // we'll use the breadcrumb trail here to gather the steps traversed
  return flow.breadcrumbs.map(stepId => {
    const step = flow.steps.find((step: any) => step.id === stepId);
    // return step;
    return new FlowStep(cloneDeep(step));
  });
});

export const selectCurrentStepId = createSelector(selectFlow, (flow: FlowState) => {
  return flow.currentStepId;
  // let currentStep;
  // if (!flow?.currentStep) {
  //   return {} as FlowStep;
  // }
  // if (!(flow?.currentStep instanceof FlowStep)) {
  //   // @ts-ignore
  //    currentStep = new FlowStep(cloneDeep(flow.currentStep));
  // }
  // return currentStep as FlowStep;
});
export const selectAllVariables = createSelector(selectFlow, (flow: FlowState) => accumulateVariables(flow.steps));

export const selectFlowTimeline = createSelector(selectFirstStepId, selectBreadcrumbs, selectSteps, selectLinks, selectCurrentStepId, selectAllVariables, (firstStepId, breadcrumbs, steps, links, currentStep, variables) => {
  const firstStep = steps.find((step: any) => step.id === firstStepId)
  const timeline: FlowStep[] = [firstStep];

  const getNextLink = (stepId: string | undefined): any => {
    const nextLink = links.find((link: any) => stepId === link.from.id);

    // TODO based on the current variables in your flow, this is the path you're on.
    if (nextLink?.to instanceof FlowStep) {
      timeline.push(nextLink.to);
      return getNextLink(nextLink.to.id);
    } else if (nextLink?.to instanceof FlowRouter) {

      const init: FlowRouter = nextLink.to;
      const nextStepId = init.evaluate(variables);
      if (nextStepId) {
        let step = steps.find((step: any) => step.id === nextStepId)
        timeline.push(step);
        return getNextLink(step.id);
      }

    }
    return timeline as FlowStep[];
  }

  return getNextLink(firstStepId);
});

export const selectProcessId = createSelector(selectFlow, (flow: FlowState) => flow.processId);


// export const selectCurrentStepIdId = createSelector(selectFlow, (flow: FlowState) => flow.currentStep.id);
export const selectIsValid = createSelector(selectSteps, selectCurrentStepId, (steps: FlowStep[], currentStepId) => {
  if(currentStepId) {
    const found = steps.find((step: any) => step.id === currentStepId);
    if(found) {
      return found.valid;
    }
  }
  return false;
});

export const selectStepHistory = createSelector(selectFlow, (flow: FlowState) => flow.stepHistory);

// export const selectCurrentStepVariables  = createSelector(selectFlow, (flow: FlowState) => flow.currentStepVariables);
// export const selectCurrentStepValid  = createSelector(selectFlow, (flow: FlowState) => flow.currentStepValid);


export const selectVariableByKey = (key: string) => createSelector(selectAllVariables, (variables: { [key: string]: any }) => {
  return variables[key];
});

export const selectStepById = (id: string) => createSelector(selectSteps, (entities: FlowStep[]) => entities.filter((item: FlowStep) => item.id === id).map((step: any) => step._deserialize()));
export const selectRouterById = (id: string) => createSelector(selectRouters, (entities: FlowRouter[]) => entities.filter((item: FlowRouter) => item.id === id).map((router: any) => router._deserialize()));
export const selectLinkById = (id: string) => createSelector(selectLinks, (entities: FlowLink[]) => entities.find((item: FlowLink) => (<FlowStep | FlowRouter>item.to).id === id)?._deserialize());


/**
 * Used to get the current state of flow variables
 * aggregates from steps
 * @param steps
 */
export function accumulateVariables(steps: FlowStep[]): { [key: string]: string | number | Date } {
  let items: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(steps)) {
    items = {...items, ...value['variables']};
  }

  return items;
}

