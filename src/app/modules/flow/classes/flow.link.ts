import { FlowBaseModel } from './index';
import { FlowSerialization } from './flow.serialization';

type OmitMethods = '_serialize' | '_deserialize';

export class FlowLink extends FlowBaseModel implements FlowSerialization<FlowLink> {
  public from: string;
  public to: string; // can be a flow step id or flow router id

  constructor(
    data: Omit<FlowLink, OmitMethods>
  ) {
    super(data.id);
    this.from = data.from;
    this.to = data.to;
  }

  public _serialize(): FlowLink {
    // if(typeof this.from !== 'string'){
    //   this.from = (<FlowStep>this.from)._serialize();
    // }
    // if(typeof this.to !== 'string'){
    //   this.to = (<FlowStep | FlowRouter>this.to)._serialize();
    // }

    return this;
  }

  // public _deserialize(): FlowLink {
  //   const data: FlowLink = {...cloneDeep(this)};
  //   // @ts-ignore
  //   data.to = (<FlowStep>data.to)._deserialize();
  //   // @ts-ignore
  //   data.from = (<FlowStep>data.from)._deserialize();
  //   // @ts-ignore
  //   return new FlowLink(data);
  // }
}
