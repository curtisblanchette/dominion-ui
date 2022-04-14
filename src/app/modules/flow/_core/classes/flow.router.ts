import { FlowStep, FlowNode, FlowCondition } from "../index";
import { cloneDeep } from 'lodash';

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    id: string | null,
    nodeText: string,
    nodeIcon: string,
    conditions: FlowCondition[]
  ) {
    super(id, nodeText, nodeIcon);
    this.conditions = conditions;
  }

  public evaluate(): FlowStep {
    return <FlowStep>this.conditions.find(condition => condition.evaluate())?.to;
  }

  serialize() {
    const data: FlowRouter = { ...cloneDeep(this)};
    // @ts-ignore
    return new FlowRouter(...data);
  }

  deserialize() {
  }

}
