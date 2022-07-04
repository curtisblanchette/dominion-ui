import { FlowBaseModel, FlowStep, FlowRouter } from "./index";
import { FlowSerialization } from './flow.serialization';
import { cloneDeep } from 'lodash';
import { Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromFlow from '../store/flow.reducer';
import { lastValueFrom, take } from 'rxjs';
import { accumulateVariables, FlowState } from '../store/flow.reducer';
import { AppState } from '../../../store/app.reducer';
import { ModuleTypes } from '../../../data/entity-metadata';

export class FlowListParams {
  public _params: {[key: string]: string} = {};

  public setParam(param: string, value: string) {
    this._params = Object.assign(this._params, {[param]: value});
  }

  public getParams(): {[key: string]: string} {
    return this._params;
  }
}

export interface IEvaluation {
  variable: string; // any flow variable key
  equals?: any;
  exists?: boolean;
  forwardParams?: {
    [key: string]: ModuleTypes
  };
  trigger?: {
    service: 'FlowService';
    fn: string;
    args: ['inbound'];
  };
}

type OmitMethods = '_serialize' | '_deserialize' | 'evaluate' | 'resolveParams' | 'getVariable';

export class FlowCondition extends FlowBaseModel implements FlowSerialization<FlowCondition> {
  public evaluation: IEvaluation;
  public forwardParams: any;
  public to: (FlowStep | FlowRouter) | Omit<(FlowStep | FlowRouter), OmitMethods>;

  constructor(
    data: Omit<FlowCondition, OmitMethods>,
  ) {
    super(data.id);
    this.evaluation = data.evaluation;
    this.forwardParams = data.forwardParams;
    this.to = data.to;
  }

  public async evaluate(): Promise<boolean> {

    let result = false;
    if(this.evaluation.hasOwnProperty('variable')) {

      if(this.evaluation.hasOwnProperty('equals')){
        result = await this.getVariable(this.evaluation.variable) === this.evaluation.equals;
      }

      if(this.evaluation.hasOwnProperty('exists')) {
        let response = await this.getVariable(this.evaluation.variable);
        if( response == undefined ){
          if( !this.evaluation.exists ){
            result = true;
          }
        } else {
          result = !!response;
        }
        console.log('result', result);
      }

      return result;

    }


    return <any>this.evaluation;
  }

  public resolveParams(): FlowListParams {
    const params = new FlowListParams();

    for(const key in Object.keys(this.forwardParams)) {
       const value = this.getVariable(key)
       params.setParam(key, value);
    }

    return params;
  }

  public _serialize(): FlowCondition {
    this.to = (<FlowStep|FlowRouter>this.to)._serialize();

    return this;
  }

  public _deserialize(): FlowCondition {
    const data: FlowCondition = { ...cloneDeep(this) };
        // this.evaluation = fn;
    // data.component = new (<any>FlowStep)[data.component]();
    return new FlowCondition(data);
  }

  public getVariable(key: string): any {
    const state: FlowState = JSON.parse(localStorage.getItem('state') || '').flow;
    const currentVariables = state.currentStep.variables;
    const variables = accumulateVariables(state.stepHistory);
    const merged = {variables, ...currentVariables};
    return merged[key];
  }
}
