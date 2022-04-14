import { v4 as uuidv4 } from "uuid";

export class FlowBaseModel {
  public id: string;

  constructor(
    id: string | null
  ) {
    if(!id) {
      this.id = uuidv4();
    } else {
      this.id = id;
    }
  }
}
