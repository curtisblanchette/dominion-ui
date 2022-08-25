import { FlowBaseModel } from './flow.baseModel';

export enum BotActionStatus {
  INITIAL = 'initial',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure'
}


export class BotAction extends FlowBaseModel{
  name: string;
  icon: string;
  status: BotActionStatus
  message: string;
  errorMessage?: string;

  constructor(
    data: any
  ) {
    super(data?.id);
  }
}
