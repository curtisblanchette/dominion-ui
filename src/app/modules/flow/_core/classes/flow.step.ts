import { FlowNode } from "./index";
import { FlowComponentType } from "../step-components";
import { cloneDeep } from 'lodash';

export class FlowStep extends FlowNode {

  public override id?: string;
  public override nodeText: string;
  public override nodeIcon: string;
  public component: FlowComponentType
  public data: any;

  constructor(
    data: Omit<FlowStep, 'serialize' | 'deserialize' | 'apply' | 'save'>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.component = data.component;
    this.data = data.data;
  }

  apply(data: FlowStep) {
    Object.assign(this, data);
  }

  public save() {

  }

  serialize() {
    const data: FlowStep = { ...cloneDeep(this) };
    return new FlowStep( data);
  }

  deserialize() {
  }
}
