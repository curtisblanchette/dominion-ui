import { FlowNode } from "./flow.node";
import { FlowComponentType } from "../../components";

export class FlowStep extends FlowNode {

  public component: FlowComponentType
  public data: any;

  constructor(
    nodeText: string,
    component: FlowComponentType,
    data?: any
  ) {
    super(nodeText);
    this.component = component;
    this.data = data;
  }

  public save() {

  }
}
