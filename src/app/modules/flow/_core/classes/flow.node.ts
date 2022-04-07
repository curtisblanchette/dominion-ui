import { FlowBaseModel } from "./flow.baseModel";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;

  constructor(
    nodeText: string,
  ) {
    super();
    this.nodeText = nodeText;
  }
}
