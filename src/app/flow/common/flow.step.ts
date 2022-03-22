import { FlowNode } from "./flow.node";
import { Type } from "@angular/core";

export class FlowStep extends FlowNode {

  constructor(
    nodeText: string,
    component: Type<any>,
    data?: any
  ) {
    super(nodeText, component, data);
  }

  public save() {

  }
}
