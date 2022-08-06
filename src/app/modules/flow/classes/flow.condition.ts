import { FlowBaseModel, FlowStep, FlowRouter } from './index';
import { FlowSerialization } from './flow.serialization';
import { cloneDeep } from 'lodash';
import { accumulateVariables, FlowState } from '../store/flow.reducer';
import { ModuleTypes } from '../../../data/entity-metadata';

export class FlowListParams {
  public _params: { [key: string]: string } = {};

  public setParam(param: string, value: string) {
    this._params = Object.assign(this._params, {[param]: value});
  }

  public getParams(): { [key: string]: string } {
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
}

type OmitMethods = '_serialize' | '_deserialize' | 'evaluate' | 'resolveParams' | 'getVariable' | 'variableExists';

export class FlowCondition extends FlowBaseModel implements FlowSerialization<FlowCondition> {
  public name: string;
  public evaluation: IEvaluation | string;
  public forwardParams: any;
  public to: string | undefined;

  constructor(
    data: Omit<FlowCondition, OmitMethods>
  ) {
    super(data.id);
    this.name = data.name;
    this.evaluation = data.evaluation;
    this.forwardParams = data.forwardParams;
    this.to = data.to;


    if(typeof data.evaluation === 'function') {
      this.evaluation = String(data.evaluation);
    } else {
      this.evaluation = data.evaluation;
    }

  }

  public evaluate(variables: any): boolean {

    let result = false;
    if(typeof this.evaluation === 'object') {
      if (this.evaluation.hasOwnProperty('variable')) {

        if (this.evaluation.hasOwnProperty('equals')) {
          return variables[this.evaluation.variable] === this.evaluation.equals;
        }

        if (this.evaluation.hasOwnProperty('exists')) {
          return variables[this.evaluation.variable];
        }

        return result;
      }
    }

    if(typeof this.evaluation === 'string') {
      // function that needs to be eval'd.
      const sourceMapComment = `\n //# sourceURL=${this.name}Condition.js \n`;
      this.evaluation = this.evaluation.concat(sourceMapComment);
      let code = eval(this.evaluation);
      return code(variables);
    }

    return <any>this.evaluation;
  }

  public resolveParams(): FlowListParams {
    const params = new FlowListParams();

    for (const key in Object.keys(this.forwardParams)) {
      const value = this.getVariable(key)
      params.setParam(key, value);
    }

    return params;
  }

  public _serialize(): FlowCondition {
    return this;
  }

  public _deserialize(): FlowCondition {
    const data: FlowCondition = {...cloneDeep(this)};
    // this.evaluation = fn;
    // data.component = new (<any>FlowStep)[data.component]();
    return new FlowCondition(data);
  }

  public getVariable(key: string): any {
    const state: FlowState = JSON.parse(localStorage.getItem('state') || '').flow;
    const variables = accumulateVariables(state.steps);
    return variables[key];
  }

  public variableExists(key: string): boolean {
    const state: FlowState = JSON.parse(localStorage.getItem('state') || '').flow;
    const variables = accumulateVariables(state.steps);
    return variables.hasOwnProperty(key);
  }

}
