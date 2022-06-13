import { FlowNode } from "./index";
import { cloneDeep } from 'lodash';

export class FlowStep extends FlowNode {

  public override id?: string;
  public override nodeText: string;
  public override nodeIcon: string;
  public component: any; // TODO make this type right
  public data: any;

  private readonly _constructedAt: number = 0;
  private _destroyedAt: number = 0;

  constructor(
    data: Omit<FlowStep, 'serialize' | 'deserialize' | 'apply' | 'save' | 'release' | 'elapsed'>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.component = data.component;
    this.data = data.data;

    this._constructedAt = new Date().getTime();

  }

  public apply(data: FlowStep): void {
    Object.assign(this, data);
  }

  public save(): void {

  }

  public serialize(): FlowStep {
    const data: FlowStep = { ...cloneDeep(this) };
    return new FlowStep(data);
  }

  public deserialize() {
  }

  public release(): void {
    this._destroyedAt = new Date().getTime();
  }

  get elapsed() {
    return this._destroyedAt - this._constructedAt;
  }
}
