import { combineReducers, ActionReducer, createSelector, Store } from '@ngrx/store';
// import { compose } from '@ngrx/core';
import * as fromLogin from './modules/login/reducers/login';
// import * as fromAutomatedIntake from './modules/automated-intake/reducers/automated-intake.reducer';
// import * as fromDataSources from './modules/settings/users/reducers/users-admin.reducers';
// import * as fromWorkspaceWizard from './modules/system-administration/workspace-wizard/reducers/workspace-wizard.reducer';
// import * as fromIntelligence from './modules/marketing/intelligence/store/intelligence.reducers';
// import * as fromLSR from './modules/marketing/lead-source-ranking-v2/store/lead-source-ranking.reducers';
// import * as fromSidebar from './common/sidebar/store/sidebar.reducer';
import { Observable, take, pipe } from 'rxjs';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  authentication: fromLogin.State;
//   automatedIntake: fromAutomatedIntake.State;
//   dataSources: fromDataSources.State;
//   workspaceWizard: fromWorkspaceWizard.State;
//   intelligence: fromIntelligence.State;
//   LSR: fromLSR.State;
//   sidebar: fromSidebar.State;
}

/**
 * Because meta reducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  authentication: fromLogin.reducer,
//   automatedIntake: fromAutomatedIntake.reducer,
//   dataSources: fromDataSources.reducer,
//   workspaceWizard: fromWorkspaceWizard.reducer,
//   intelligence: fromIntelligence.reducer,
//   LSR: fromLSR.reducer,
//   sidebar: fromSidebar.reducer
};

const combinedReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return combinedReducer(state, action);
}

// export { reducer, State };


///////////////////////////////////////////////////
//               AUTHENTICATION                  //
///////////////////////////////////////////////////

export const getUserState = (state:State) => fromLogin.getUserRecord(fromLogin.initialState);
export const getAgentState = (state:State) => fromLogin.getAgentRecord(fromLogin.initialState);
export const getWorkspaceState = (state:State) => fromLogin.getWorkspaceRecord(fromLogin.initialState);

export const getUser = createSelector( getUserState, ( user ) => { return user; } );
export const getAgent = createSelector( getAgentState, ( agent ) => { return agent; } );
export const getWorkspace = createSelector( getWorkspaceState, ( workspace ) => { return workspace; } );


// export const getAgent = createSelector( getAuthentication, fromLogin.getUserRecord );
// export const getUser = fromLogin.getUserRecord( getAuthentication('user') );
// export const getUser = compose(fromLogin.getUserRecord, getAuthentication);
// export const getAgent = compose(fromLogin.getAgentRecord, getAuthentication);


///////////////////////////////////////////////////
//              AUTOMATED INTAKE                 //
///////////////////////////////////////////////////
// export function getAutomatedIntake(state$: Observable<State>) {
//   return state$.select(state => state.automatedIntake);
// }

// export const getWizardCurrentStep = compose(fromAutomatedIntake.getWizardStep, getAutomatedIntake);
// export const getCallFlow = compose(fromAutomatedIntake.getCallFlow, getAutomatedIntake);
// export const getActiveCall = compose(fromAutomatedIntake.getActiveCall, getAutomatedIntake);


///////////////////////////////////////////////////
//                   LOGIN                       //
///////////////////////////////////////////////////
// export function getWorkspaceRecord(state$: Observable<State>) {
//   return state$.select(state => state.authentication);
// }

// export const getWorkspace = compose(fromLogin.getWorkspaceRecord, getWorkspaceRecord);


///////////////////////////////////////////////////
//                DATA SOURCES                   //
///////////////////////////////////////////////////
// export function getCurrentDataSources(state$: Observable<State>) {
//   return state$.select(state => state.dataSources);
// }

// export const getDataSources = compose(fromDataSources.getDataSources, getCurrentDataSources);


///////////////////////////////////////////////////
//              WORKSPACE WIZARD                 //
///////////////////////////////////////////////////
// export function getCurrentWizardState(state$: Observable<State>) {
//   return state$.select(state => state.workspaceWizard);
// }

// export const getWizardState = compose(fromWorkspaceWizard.getCurrentState, getCurrentWizardState);


///////////////////////////////////////////////////
//                INTELLIGENCE                   //
///////////////////////////////////////////////////
// export function getIntelligenceState(state$: Observable<State>) {
//   return state$.select(state => state.intelligence);
// }

// export const getIntelligence = compose(fromIntelligence.getAll, getIntelligenceState);


///////////////////////////////////////////////////
//             LEAD SOURCE RANKING               //
///////////////////////////////////////////////////
// export function getLSRState(state$: Observable<State>) {
//   return state$.select(state => state.LSR);
// }

// export const getLSR = compose(fromLSR.getAll, getLSRState);


///////////////////////////////////////////////////
//                   SIDEBAR                     //
///////////////////////////////////////////////////
// export function getSidebarState(state$: Observable<State>) {
//   return state$.select(state => state.sidebar);
// }

// export const getSidebar = compose(fromSidebar.getAll, getSidebarState);
