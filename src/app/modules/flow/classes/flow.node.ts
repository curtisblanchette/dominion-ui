import { FlowBaseModel } from "./index";

export class FlowNode extends FlowBaseModel {
  public nodeText: string;
  public nodeIcon: string;

  constructor(
    nodeText: string,
    nodeIcon: string,
    id?: string,
  ) {
    super(id);
    this.nodeText = nodeText;
    this.nodeIcon = nodeIcon;
  }
}
