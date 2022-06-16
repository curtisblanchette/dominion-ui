import { FlowStep, FlowNode, FlowCondition, FlowListParams } from './index';
import { cloneDeep } from 'lodash';
import { FlowDataComponent, FlowListComponent } from '../step-components';
import { FlowSerialization } from './flow.serialization';

export class FlowRouter extends FlowNode implements FlowSerialization<FlowRouter> {
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

  /**
   * Evaluates conditions attached to this router.
   *
   * @returns {FlowNode | undefined}
   */
  public async evaluate():Promise<FlowNode | undefined> {
    let step: FlowStep | FlowNode | undefined = undefined;

    if( this.conditions ){
      for (const cond of this.conditions) {
        const value = await cond.evaluate();
        if (value) {

          if (cond?.to) {
            step = <FlowStep>cond?.to as FlowStep;

            /**********************************************************
             ----------------- INJECTION POINT ------------------------
             **********************************************************/
             // Use this location to mutate components before rendering
             // example: Set Query Params returned by conditions
            if(value instanceof FlowListParams) {

              // FlowDataComponent
              const instance = new (<FlowStep>step).component();
              if(instance instanceof FlowDataComponent) {
                (<FlowStep>step).data.id = value.getParams()[`${(<FlowStep>step).data.module}Id`];
              }

              // FlowListComponent
              if(instance instanceof FlowListComponent) {
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

  public _serialize(): string {
    return JSON.stringify(this);
  }

  public _deserialize(): FlowRouter {
    const data: FlowRouter = { ...cloneDeep(this) };
    return new FlowRouter(data.nodeText, data.nodeIcon, data.conditions, data.id);
  }

}
