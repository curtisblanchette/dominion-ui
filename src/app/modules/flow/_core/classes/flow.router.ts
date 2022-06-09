import { FlowStep, FlowNode, FlowCondition, FlowListParams } from './index';
import { cloneDeep } from 'lodash';

export class FlowRouter extends FlowNode {
  public conditions: FlowCondition[];

  constructor(
    nodeText: string,
    nodeIcon: string,
    conditions: FlowCondition[],
    id?: string,
  ) {
    super(nodeText, nodeIcon, id);
    this.conditions = conditions;
  }

  public async evaluate():Promise<FlowRouter | FlowStep | undefined> {
    let step:FlowRouter | FlowStep | undefined = undefined;

    if( this.conditions ){
      for (const cond of this.conditions) {
        const value = await cond.evaluate();
        if (value) {
          const to = cond?.to;
          if (to) {
            step = <FlowStep>to;

            if(value instanceof FlowListParams) {
              step.data.options['query'] = value.getParams();
            }

          } else {
            console.warn('There is error evaluating the next step');
          }
          break;
        }
      }
    }
    return step;
  }

  serialize() {
    const data: FlowRouter = { ...cloneDeep(this)};
    return new FlowRouter(data.nodeText, data.nodeIcon, data.conditions, data.id);
  }

  deserialize() {
  }

}
