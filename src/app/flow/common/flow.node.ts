import { FlowBaseModel } from "./flow.baseModel";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;
  public data?: any;

  constructor(
    nodeText: string,
  ) {
    super();
    this.nodeText = nodeText;
  }
}
