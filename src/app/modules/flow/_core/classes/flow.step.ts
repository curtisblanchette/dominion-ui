import { FlowNode } from "./index";
import { FlowComponentType } from "../step-components";
import { cloneDeep } from 'lodash';

export class FlowStep extends FlowNode {

  public component: FlowComponentType
  public data: any;

  constructor(
    id: string | null,
    nodeText: string,
    nodeIcon: string,
    component: FlowComponentType,
    data?: any
  ) {
    super(id, nodeText, nodeIcon);
    this.component = component;
    this.data = data;
  }

  public save() {

  }

  serialize() {
    const data: FlowStep = { ...cloneDeep(this) };
    return new FlowStep(data.id, data.nodeText, data.nodeIcon, data.component, data.data);
  }

  deserialize() {
  }
}
