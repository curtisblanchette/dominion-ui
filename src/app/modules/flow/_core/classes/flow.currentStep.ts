import { FlowStep } from './flow.step';

export interface FlowCurrentStep {
  step?: FlowStep | undefined;
  variables?: { [ key:string ] : any };
  valid?: boolean;
  serialize?: Function;
}
