
import { FlowCondition } from "./flow.condition";
import { FlowNode } from "./flow.node";

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    nodeText: string,
    conditions: FlowCondition[]
  ) {
    super(nodeText, undefined);
    this.conditions = conditions;
  }

  public evaluate() {
    for(const condition of this.conditions) {

    }
  }

}
