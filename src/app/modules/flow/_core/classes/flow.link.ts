import { FlowRouter, FlowBaseModel, FlowStep } from './index';
import { cloneDeep } from 'lodash';
import { FlowSerialization } from './flow.serialization';

export class FlowLink extends FlowBaseModel implements FlowSerialization<FlowLink> {
  public from: FlowStep;
  public to: FlowStep | FlowRouter;

  constructor(
    from: FlowStep,
    to: FlowStep | FlowRouter,
    id?: string,
  ) {
    super(id);
    this.from = from;
    this.to = to;
  }

  public _serialize(): string {
    return JSON.stringify(this);
  }

  public _deserialize(): FlowLink {
    const data: FlowLink = {...cloneDeep(this)};
    // @ts-ignore
    return new FlowLink(data.id, data.from, data.to);
  }
}
