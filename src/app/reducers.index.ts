import { combineReducers, ActionReducer, createSelector, Store, createFeatureSelector } from '@ngrx/store';
import * as fromLogin from './modules/login/store/login.reducer';
import { loginEffects } from './modules/login/store/login.effects';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  authentication: fromLogin.State;
}

/**
 * Because meta reducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  authentication: fromLogin.reducer
};

const combinedReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  return combinedReducer(state, action);
}

export const effects: any[] = [loginEffects];

///////////////////////////////////////////////////
//               AUTHENTICATION                  //
///////////////////////////////////////////////////

export const getUserState = (state:State) => fromLogin.getUserRecord(fromLogin.initialState);
export const getAgentState = (state:State) => fromLogin.getAgentRecord(fromLogin.initialState);
export const getWorkspaceState = (state:State) => fromLogin.getWorkspaceRecord(fromLogin.initialState);

export const getUser = createSelector( getUserState, ( user ) => { return user; } );
export const getAgent = createSelector( getAgentState, ( agent ) => { return agent; } );
export const getWorkspace = createSelector( getWorkspaceState, ( workspace ) => { return workspace; } );