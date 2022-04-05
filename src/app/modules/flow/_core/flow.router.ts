import { FlowStep, FlowNode, FlowCondition } from "./index";

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    nodeText: string,
    conditions: FlowCondition[]
  ) {
    super(nodeText);
    this.conditions = conditions;
  }

  public evaluate(): FlowStep {
    return <FlowStep>this.conditions.find(condition => condition.evaluate())?.to;
  }

}
