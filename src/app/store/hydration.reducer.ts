// hydration.reducer.ts
import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { AppState } from './app.reducer';
import * as flowActions from '../modules/flow/store/flow.actions';

export const hydrationMetaReducer = (
  reducer: ActionReducer<AppState>
): ActionReducer<AppState> => {
  return (state, action: any) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem("state");
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem("state");
        }
      }
    }

    const nextState = reducer(state, action);


    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
