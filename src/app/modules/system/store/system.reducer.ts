import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import * as systemActions from './system.actions';
import { DropdownItem } from '../../../common/components/ui/forms';

export interface SystemState {
  workspaces: DropdownItem[] | []
}


export const initialState: SystemState = {
  workspaces: localStorage.getItem('workspaces') && JSON.parse(localStorage.getItem('workspaces') || '[]') || []
};

export const reducer = createReducer(
  initialState,
  on(systemActions.GetWorkspacesAction, (state) => ({ ...state })),
  on(systemActions.SetWorkspacesAction, (state, {payload}) => ({ ...state, workspaces: payload })),
);

export const selectSystem = createFeatureSelector<SystemState>('system');

export const selectWorkspaces  = createSelector(selectSystem, (system: SystemState) => system.workspaces);

