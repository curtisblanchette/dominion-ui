import { FlowBaseModel } from "./flow.baseModel";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;
  public nodeIcon: string;

  constructor(
    id: string | null,
    nodeText: string,
    nodeIcon: string,
  ) {
    super(id);
    this.nodeText = nodeText;
    this.nodeIcon = nodeIcon;
  }
}
