import { FlowRouter, FlowBaseModel, FlowStep } from './index';
import { cloneDeep } from 'lodash';

export class FlowLink extends FlowBaseModel {
  public from: FlowStep;
  public to: FlowStep | FlowRouter;

  constructor(
    id: string | null,
    from: FlowStep,
    to: FlowStep | FlowRouter
  ) {
    super(id);
    this.from = from;
    this.to = to;
  }

  public async run(): Promise<void> {
    await this.beforeRouting();
  }

  public async beforeRouting() {
    // apply any model changes.
    await this.from.save();
  }


  serialize() {
    const data: FlowLink = {...cloneDeep(this)};
    // @ts-ignore
    return new FlowLink(data.id, data.from, data.to);
  }

  deserialize() {
  }
}
