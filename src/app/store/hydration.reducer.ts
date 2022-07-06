// hydration.reducer.ts
import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { AppState } from './app.reducer';
import * as flowActions from '../modules/flow/store/flow.actions';
import { FlowStep } from '../modules/flow';

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

    if(action.type === flowActions.AddStepAction.type) {
      console.log(action);
      action.payload = action.payload._serialize();
    }

    if(action.type === flowActions.AddRouterAction.type) {
      const serialized = action.payload._serialize();
      action.payload = serialized;
    }

    if(action.type === flowActions.UpdateCurrentStepAction.type) {
      // action.step.serialize();
    }

    const nextState = reducer(state, action);


    localStorage.setItem("state", JSON.stringify(nextState));
    return nextState;
  };
};
