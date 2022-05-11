import { FlowStep, FlowNode, FlowCondition } from "./index";
import { cloneDeep } from 'lodash';

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    nodeText: string,
    nodeIcon: string,
    conditions: FlowCondition[],
    id?: string,
  ) {
    super(nodeText, nodeIcon, id);
    this.conditions = conditions;
  }

  public evaluate(): FlowStep {
    return <FlowStep>this.conditions.find(condition => condition.evaluate())?.to;
  }

  serialize() {
    const data: FlowRouter = { ...cloneDeep(this)};
    return new FlowRouter(data.nodeText, data.nodeIcon, data.conditions, data.id);
  }

  deserialize() {
  }

}
