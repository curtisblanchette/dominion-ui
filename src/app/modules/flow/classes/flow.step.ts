import { FlowNode } from "./index";
import { FlowSerialization } from './flow.serialization';
import { OnDestroy } from '@angular/core';

type OmitMethods = '_serialize' | '_deserialize' | 'apply' | 'save' | 'release' | 'elapsed';

export class FlowStep extends FlowNode implements FlowSerialization<FlowStep> {

  public override id?: string;
  public override nodeText: string;
  public override nodeIcon: string;
  public component: any; // TODO make this type right

  public beforeRoutingTriggers: string;
  public afterRoutingTriggers: string;

  public state: any;
  public valid?: boolean;
  public variables?: {[key: string]: any};

  public _constructedAt?: number;
  public _destroyedAt?: number;

  constructor(
    data: Omit<FlowStep, OmitMethods>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.component = data.component;
    this.state = data.state;
    this._constructedAt = 0;

    if(typeof data.beforeRoutingTriggers === 'function') {
      this.beforeRoutingTriggers = String(data.beforeRoutingTriggers);
    } else {
      this.beforeRoutingTriggers = data.beforeRoutingTriggers;
    }
    if(typeof data.afterRoutingTriggers === 'function') {
      this.afterRoutingTriggers = String(data.afterRoutingTriggers);
    } else {
      this.afterRoutingTriggers = data.afterRoutingTriggers;
    }

    // only modify constructed at if its unset
    if(data._constructedAt) {
      this._constructedAt = new Date().getTime();
    } else {
      this._constructedAt = data._constructedAt;
    }

    this.valid = data.valid || false;
    this.variables = data.variables || {};

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
    if(!this._destroyedAt || !this._constructedAt) {
        return 0;
    }
    return this._destroyedAt - this._constructedAt;
  }

  public _serialize(): FlowStep {
    // we need to keep the step.component class name so that it can be retrieved again
    // if(typeof this.component !== 'string') {
    //   this.component = this.component.name;
    // }
    //
    // if(typeof this.beforeRoutingTriggers === 'function') {
    //   this.beforeRoutingTriggers = this.beforeRoutingTriggers.toString();
    // }
    //
    // if(typeof this.afterRoutingTriggers === 'function') {
    //   this.afterRoutingTriggers = this.afterRoutingTriggers.toString();
    // }

    return this;
  }

  public _deserialize(): FlowStep {
    const data: FlowStep = { ...this };

    return new FlowStep(data);
  }

}
