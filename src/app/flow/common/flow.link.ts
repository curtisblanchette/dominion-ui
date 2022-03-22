import { FlowRouter } from "./flow.router";
import { FlowBaseModel } from "./flow.baseModel";
import { FlowStep } from "./flow.step";
import { FlowStepItem } from "./flow.step-item";

export class FlowLink extends FlowBaseModel {
  public from: FlowStepItem;
  public to: FlowStepItem | FlowRouter;

  constructor(
    from: FlowStepItem,
    to: FlowStepItem | FlowRouter
  ) {
    super();
    this.from = from;
    this.to = to;
  }

  public async run(): Promise<void> {
    await this.beforeRouting();
  }

  public async beforeRouting() {
    // apply any model changes.
    await this.from.save();
  }
}
