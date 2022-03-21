import { createReducer, on } from '@ngrx/store';

import * as loginActions from '../actions/login';
import { User } from '../models/user';


export interface State {
    user: User | null;
    agent: any;
    workspace: any;
}

function isBase64( str:string ) {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
}

function getUserInitialState(){
    const userData = localStorage.getItem('user');
    if( userData ){
        return isBase64(userData) && JSON.parse(atob(userData)) || null;
    }
    return null;
}

function getAgentInitialState(){
    const agentData = localStorage.getItem('agent');
    if( agentData && agentData !== 'undefined' ){
        return JSON.parse(agentData);
    }
    return null;
}

function getWorkspaceInitialState(){
    const workspaceData = localStorage.getItem('workspace');
    if( workspaceData ){
        isBase64(workspaceData) && JSON.parse(atob(workspaceData)) || null;
    }
    return null;
}

export const initialState: State = {
    user : getUserInitialState(),
    agent: getAgentInitialState(),
    workspace: getWorkspaceInitialState()
};

export const reducer = createReducer(
    initialState,
    on(loginActions.LogUserAction, (state, { payload }) => ({...state, ...payload })),
    on(loginActions.LogInSuccesfullAction, (state, { payload }) => ( {...state, user: payload} )),
    on(loginActions.LogInErrorAction, (state) => ( {...state } )),
    on(loginActions.SetAgentRecord, (state, { payload }) => ( {...state, agent: payload} )),
    on(loginActions.SetWorkspaceRecord, (state, { payload }) => ( {...state, workspace: payload} )),
    on(loginActions.LogoutUserAction, (state) => ( { user: null, agent : null, workspace : null } ))
);

export const getUserRecord = (state:State) => state.user;
export const getAgentRecord = (state:State) => state.agent;
export const getWorkspaceRecord = (state:State) => state.workspace;