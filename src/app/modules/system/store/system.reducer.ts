import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as systemActions from './system.actions';
import { DropdownItem } from '../../../common/components/ui/forms';
import { getInitialStateByKey } from '../../../store/util';


export interface SystemState {
  workspaces: DropdownItem[];
  actingFor: DropdownItem | null;
  loading: boolean;
}

export const initialState: SystemState = {
  workspaces: getInitialStateByKey('system.workspaces') || [],
  actingFor: getInitialStateByKey('system.actingFor') || null,
  loading: false
};

export const reducer = createReducer(
  initialState,
  on(systemActions.GetWorkspacesAction, (state) => ({...state})),
  on(systemActions.SetWorkspacesAction, (state, { payload }) => ({...state, workspaces: payload})),
  on(systemActions.SetActingForAction, (state, { payload }) => ({...state, actingFor: payload })),
  on(systemActions.SendInvitationAction, (state) => ({...state, loading: true})),
  on(systemActions.SendInvitationSuccessAction, (state) => ({...state, loading: false})),
  on(systemActions.SendInvitationErrorAction, (state) => ({...state, loading: false})),
  on(systemActions.ClearAction, (state) => ({...state, workspaces: [], loading: false, actingFor: null}))
);

export const selectSystem = createFeatureSelector<SystemState>('system');

export const loading = createSelector(selectSystem, (system: SystemState) => system.loading);

export const selectWorkspaces = createSelector(selectSystem, (system: SystemState) => system.workspaces);

export const selectActingFor = createSelector(selectSystem, (system: SystemState) => system.workspaces.find(ws => ws.id === system.actingFor?.id));
