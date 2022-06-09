import { FlowBaseModel, FlowStep, FlowRouter } from "./index";

export class FlowListParams {
  public _params: {[key: string]: string} = {};

  public setParam(param: string, value: string) {
    this._params = Object.assign(this._params, {[param]: value});
  }

  public getParams(): {[key: string]: string} {
    return this._params;
  }
}

export class FlowCondition extends FlowBaseModel {
  public evaluation: boolean | Function | FlowListParams;
  public to: FlowStep | FlowRouter;

  constructor(
    evaluation: boolean | Function,
    to: FlowStep | FlowRouter,
    id?: string
  ) {
    super(id);
    this.evaluation = evaluation;
    this.to = to;
  }

  public evaluate(): FlowListParams | boolean {

    if(this.evaluation instanceof Function) {
      return this.evaluation();
    }

    return this.evaluation;
  }
}
