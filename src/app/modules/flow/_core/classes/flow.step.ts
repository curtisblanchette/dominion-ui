import { FlowNode } from "./flow.node";
import { FlowComponentType } from "../../components";

export class FlowStep extends FlowNode {

  public component: FlowComponentType
  public data: any;

  constructor(
    nodeText: string,
    nodeIcon: string,
    component: FlowComponentType,
    data?: any
  ) {
    super(nodeText, nodeIcon);
    this.component = component;
    this.data = data;
  }

  public save() {

  }
}
