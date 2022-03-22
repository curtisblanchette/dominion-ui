import { FlowCondition } from "./flow.condition";
import { FlowNode } from "./flow.node";
import { FlowStepItem } from "./flow.step-item";

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    nodeText: string,
    conditions: FlowCondition[]
  ) {
    super(nodeText, undefined);
    this.conditions = conditions;
  }

  public evaluate(): FlowStepItem {
    return <FlowStepItem>this.conditions.find(condition => condition.evaluate())?.to;
  }

}
