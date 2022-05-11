import { FlowBaseModel, FlowStep, FlowRouter } from "./index";

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
    to: FlowStep | FlowRouter,
    id?: string
  ) {
    super(id);
    this.evaluation = evaluation;
    this.to = to;
  }

  public evaluate() {
    if(this.evaluation instanceof IEvaluation) {

      // switch(this.evaluation.operator) {
      //   case FlowConditionOperators.EQUALS:
      //     return this.evaluation.attribute > this.evaluation.value;
      //
      //   case FlowConditionOperators.NOT_EQUALS:
      //     return;
      //
      //   case FlowConditionOperators.GREATER_THAN:
      //     return this[this.evaluation.module][this.evaluation.attribute] > this.evaluation.value;
      //
      //   case FlowConditionOperators.LESS_THAN:
      //     // @ts-ignore
      //     return this[this.evaluation.module][this.evaluation.attribute] < this.evaluation.value;
      //
      //   case FlowConditionOperators.LIKE:
      //     return;
      //
      // }

    }

    if(this.evaluation instanceof Function) {
      return this.evaluation();
    }

    return this.evaluation;
  }
}
