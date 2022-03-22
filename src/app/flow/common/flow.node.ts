import { FlowBaseModel } from "./flow.baseModel";
import { FlowStep } from "./flow.step";
import { Type } from "@angular/core";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;
  public data?: any;

  constructor(
    nodeText: string,
    component?: Type<any>,
    data?: any
  ) {
    super();
    this.nodeText = nodeText;
    this.data = data;
  }
}
