import { Type } from '@angular/core';
import { FlowStep } from "./flow.step";

export class FlowStepItem extends FlowStep {
  constructor(
    nodeText: string,

    public component: Type<any>,
    public override data: any
  ) {
    super(nodeText, component)
  }
}
