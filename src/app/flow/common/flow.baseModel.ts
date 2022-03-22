import { v4 as uuidv4 } from "uuid";

export class FlowBaseModel {
  public id: string;

  constructor() {
    this.id = uuidv4();
  }
}
