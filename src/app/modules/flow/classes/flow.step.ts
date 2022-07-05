import { FlowNode } from "./index";
import { cloneDeep } from 'lodash';
import { FlowSerialization } from './flow.serialization';

type OmitMethods = '_serialize' | '_deserialize' | 'apply' | 'save' | 'release' | 'elapsed';

export class FlowStep extends FlowNode implements FlowSerialization<FlowStep> {

  public override id?: string;
  public override nodeText: string;
  public override nodeIcon: string;
  public component: any; // TODO make this type right

  public beforeRoutingTriggers: any;
  public afterRoutingTriggers: any;

  public state: any;

  private readonly _constructedAt: number = 0;
  private _destroyedAt: number = 0;

  constructor(
    data: Omit<FlowStep, OmitMethods>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.component = data.component;
    this.state = data.state;

    this.beforeRoutingTriggers = data.beforeRoutingTriggers;
    this.afterRoutingTriggers = data.afterRoutingTriggers;

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

  public _serialize(): FlowStep {
    // we need to keep the step.component class name so that it can be retrieved again
    if(typeof this.component !== 'string'){
      this.component = this.component.name;
    }

    if(typeof this.beforeRoutingTriggers === 'function') {
      this.beforeRoutingTriggers = this.beforeRoutingTriggers.toString();
    }

    if(typeof this.afterRoutingTriggers === 'function') {
      this.afterRoutingTriggers = this.afterRoutingTriggers.toString();
    }

    return this;
  }

  public _deserialize(): FlowStep {
    const data: FlowStep = { ...cloneDeep(this) };
    // data.component = new (<FlowStepdata.component)();
    return new FlowStep(data);
  }
}
