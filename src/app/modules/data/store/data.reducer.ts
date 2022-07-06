import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as dataActions from './data.actions';

export interface DataState {
  perPage: number;
}

export const initialState: DataState = {
  perPage: parseInt(localStorage.getItem('perPage') && localStorage.getItem('perPage') || '25', 0)
};

export const reducer = createReducer(
  initialState,
  on(dataActions.GetPerPageAction, (state) => ({ ...state })),
  on(dataActions.SetPerPageAction, (state, {payload}) =>  {
    // localStorage.setItem('perPage', payload);
    return ({ ...state, perPage: payload })
  }),

);

export const selectData = createFeatureSelector<DataState>('data');


export const selectPerPage = createSelector(selectData, (state: DataState) => state.perPage);
