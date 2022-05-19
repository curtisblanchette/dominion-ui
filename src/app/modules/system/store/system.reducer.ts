import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as systemActions from './system.actions';
import { DropdownItem } from '../../../common/components/ui/forms';

export interface SystemState {
  workspaces: DropdownItem[];
  actingFor: string | null;
  loading: boolean;
}

export const initialState: SystemState = {
  workspaces: localStorage.getItem('workspaces') && JSON.parse(localStorage.getItem('workspaces') || '[]') || [],
  actingFor: localStorage.getItem('actingFor') && localStorage.getItem('actingFor') || null,
  loading: false
};

export const reducer = createReducer(
  initialState,
  on(systemActions.GetWorkspacesAction, (state) => ({ ...state })),
  on(systemActions.SetWorkspacesAction, (state, {payload}) => ({ ...state, workspaces: payload })),
  on(systemActions.SetActingForAction, (state, { id }) => ({ ...state, actingFor: id })),
  on(systemActions.SendInvitationAction, (state) => ({...state, loading: true})),
  on(systemActions.SendInvitationSuccessAction, (state) => ({...state, loading: false}))
);

export const selectSystem = createFeatureSelector<SystemState>('system');

export const loading = createSelector(selectSystem, (system: SystemState) => system.loading);

export const selectWorkspaces  = createSelector(selectSystem, (system: SystemState) => system.workspaces);

export const selectActingFor = createSelector(selectSystem, (system: SystemState) => system.workspaces.find(ws=>ws.id === system.actingFor));
