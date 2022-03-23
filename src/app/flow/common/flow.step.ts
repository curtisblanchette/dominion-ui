import { FlowNode } from "./flow.node";
import { Type } from "@angular/core";

export class FlowStep extends FlowNode {

  public component: Type<any>

  constructor(
    nodeText: string,
    component: Type<any>,
    data?: any
  ) {
    super(nodeText);
    this.component = component;
    this.data = data;
  }

  public save() {

  }
}
