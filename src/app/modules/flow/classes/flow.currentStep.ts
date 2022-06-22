import { FlowStep } from './flow.step';

export interface FlowCurrentStep {
  step?: FlowStep | undefined;
  variables?: { [ key:string ] : any };
  valid?: boolean;
  deserialize?: Function;
  serialize?: Function;
}
