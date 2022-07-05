import { FlowStep, FlowNode, FlowCondition, FlowListParams } from './index';
import { cloneDeep } from 'lodash';
import { FlowDataComponent, FlowListComponent, FlowStepClassMap } from '../steps';
import { FlowSerialization } from './flow.serialization';


type OmitMethods = 'evaluate' | '_serialize' | '_deserialize';

export class FlowRouter extends FlowNode implements FlowSerialization<FlowRouter> {
  public conditions: FlowCondition[];

  constructor(
    data: Omit<FlowRouter, OmitMethods>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.conditions = data.conditions;
  }

  /**
   * Evaluates conditions attached to this router.
   *
   * @returns {FlowNode | undefined}
   */
  public async evaluate(): Promise<FlowNode | undefined> {
    let step: FlowStep | FlowNode | undefined = undefined;

    if (this.conditions) {
      for (const cond of this.conditions) {
        const value = await cond.evaluate();
        if (value) {

          if (cond?.to) {
            step = <FlowStep>cond?.to as FlowStep;

            /**********************************************************
             ----------------- INJECTION POINT ------------------------
             **********************************************************/
            const instance = (<any>FlowStepClassMap)[(<FlowStep>step).component];
            // if(instance instanceof FlowDataComponent) {
            //   (<FlowStep>step).state.data.id = value.getParams()[`${(<FlowStep>step).state.module}Id`];
            // }

            // FlowListComponent
            if (instance instanceof FlowListComponent) {
              (<FlowStep>step).state.options['query'] = cond.resolveParams().getParams();
            }


          } else {
            console.warn('There is error evaluating the next step');
          }
          break;
        }
      }
      console.warn(`No conditions for ${this.nodeText} evaluated to 'true'`);
    }
    return step;
  }

  public _serialize(): FlowRouter {
    this.conditions = this.conditions.map(condition => condition._serialize());
    return this;
  }

  public _deserialize(): FlowRouter {
    const data: FlowRouter = {...cloneDeep(this)};
    data.conditions = data.conditions.map(condition => new FlowCondition(condition)._deserialize());
    return new FlowRouter(data);
  }

}
