import { FlowNode } from "./flow.node";
import { Type } from "@angular/core";
import { FlowComponentTypes } from "../components";

export class FlowStep extends FlowNode {

  public component: Type<FlowComponentTypes>
  public data: any;

  constructor(
    nodeText: string,
    component: Type<FlowComponentTypes>,
    data?: any
  ) {
    super(nodeText);
    this.component = component;
    this.data = data;
  }

  public save() {

  }
}
