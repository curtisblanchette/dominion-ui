import { FlowRouter } from "./flow.router";
import { FlowBaseModel } from "./flow.baseModel";
import { FlowStep } from "./flow.step";

export class FlowLink extends FlowBaseModel {
  public from: FlowStep;
  public to: FlowStep | FlowRouter;

  constructor(
    from: FlowStep,
    to: FlowStep | FlowRouter
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
