import { FlowBaseModel } from "./flow.baseModel";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;
  public nodeIcon: string;

  constructor(
    nodeText: string,
    nodeIcon: string,
  ) {
    super();
    this.nodeText = nodeText;
    this.nodeIcon = nodeIcon;
  }
}
