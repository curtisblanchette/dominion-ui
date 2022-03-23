import { FlowBaseModel, FlowStep, FlowRouter } from "./";

export class IEvaluation {
  module: string;
  attribute: string;
  operator: FlowConditionOperators;
  value: string | boolean | number;
}

export enum FlowConditionOperators {
  EQUALS = 'eq',
  GREATER_THAN = 'gt',
  LESS_THAN = 'lt',
  NOT_EQUALS = 'neq',
  LIKE = 'lk'
}

export class FlowCondition extends FlowBaseModel {
  public evaluation: boolean | Function | IEvaluation;
  public to: FlowStep | FlowRouter;

  constructor(
    evaluation: boolean | Function | IEvaluation,
    to: FlowStep | FlowRouter
  ) {
    super();
    this.evaluation = evaluation;
    this.to = to;
  }

  public evaluate() {
    if(this.evaluation instanceof IEvaluation) {
      // check the module
      // for an attribute
      // that matches the value
      // using the operator
    }

    if(this.evaluation instanceof Function) {
      return this.evaluation;
    }

    return this.evaluation;
  }
}
