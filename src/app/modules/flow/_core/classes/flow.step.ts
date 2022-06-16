import { FlowNode } from "./index";
import { cloneDeep } from 'lodash';
import { FlowSerialization } from './flow.serialization';

export class FlowStep extends FlowNode implements FlowSerialization<FlowStep> {

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

  public release(): void {
    this._destroyedAt = new Date().getTime();
  }

  get elapsed() {
    return this._destroyedAt - this._constructedAt;
  }

  public _serialize(): string {
    return JSON.stringify(this);
  }

  public _deserialize(): FlowStep {
    const data: FlowStep = { ...cloneDeep(this) };
    return new FlowStep(data);
  }
}
