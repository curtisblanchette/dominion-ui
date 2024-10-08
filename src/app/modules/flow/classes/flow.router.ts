import { FlowNode, FlowCondition } from './index';
import { cloneDeep } from 'lodash';
import { FlowSerialization } from './flow.serialization';

type OmitMethods = 'evaluate' | '_serialize' | '_deserialize';

export class FlowRouter extends FlowNode implements FlowSerialization<FlowRouter> {
  public conditions: FlowCondition[];

  constructor(
    data: Omit<FlowRouter, OmitMethods>
  ) {
    super(data.nodeText, data.nodeIcon, data.id);
    this.conditions = data.conditions.map((condition: FlowCondition) => new FlowCondition(condition));
  }

  /**
   * Evaluates conditions attached to this router.
   *
   * @returns {FlowNode | undefined}
   */
  public evaluate(variables: any): string | undefined {
    let stepId: string | undefined = undefined;

    if (this.conditions) {
      for (const cond of this.conditions) {
        const value = cond.evaluate(variables);
        if (value) {

          if (cond?.to) {
            stepId = cond?.to;

          } else {
            console.warn('There was an error evaluating the next step.');
          }
          break;
        }
      }
    }

    if(!stepId) {
      console.warn(`No conditions for '${this.nodeText}' evaluated to 'true'.`);
    }
    return stepId;
  }

  public _serialize(): FlowRouter {
    // this.conditions = this.conditions.map(condition => condition._serialize());
    return this;
  }

  public _deserialize(): FlowRouter {
    const data: FlowRouter = {...cloneDeep(this)};
    data.conditions = data.conditions.map(condition => new FlowCondition(condition));
    return new FlowRouter(data);
  }

}
