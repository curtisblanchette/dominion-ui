import { FlowStep, FlowNode, FlowCondition, FlowListParams } from './index';
import { cloneDeep } from 'lodash';
import { FlowDataComponent, FlowListComponent } from '../step-components';

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

  public async evaluate():Promise<FlowNode | undefined> {
    let step: FlowStep | FlowNode | undefined = undefined;

    if( this.conditions ){
      for (const cond of this.conditions) {
        const value = await cond.evaluate();
        if (value) {

          if (cond?.to) {
            step = <FlowStep>cond?.to as FlowStep;

            if(value instanceof FlowListParams) {

              /**
               * data and list components require a different param to be set for queries.
               * the component reference are class pointers, not instance so we have to construct one
               * don't worry we're just destroying it right away
               * we need it for the `instanceof` check
              */
              if(new (<FlowStep>step).component() instanceof FlowDataComponent) {
                /**
                 * Mutate DataComponent's nodeText and title
                 * we can reuse it for edits and creates
                */
                (<FlowStep>step).nodeText = `Review ${(<FlowStep>step).data.module}`;
                (<FlowStep>step).data.title = `Review ${(<FlowStep>step).data.module}`;
                (<FlowStep>step).data.id = value.getParams()[`${(<FlowStep>step).data.module}Id`];
              }

              if((<FlowStep>step).component instanceof FlowListComponent) {
                (<FlowStep>step).data.options['query'] = value.getParams();
              }

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
    const data: FlowRouter = { ...cloneDeep(this) };
    return new FlowRouter(data.nodeText, data.nodeIcon, data.conditions, data.id);
  }

  deserialize() {
  }

}
