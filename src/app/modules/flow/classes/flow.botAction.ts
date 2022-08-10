import { FlowBaseModel } from './flow.baseModel';

export class BotAction extends FlowBaseModel{
  name: string;
  icon: string;
  status: 'pending' | 'complete';
  message: string;

  constructor(
    data: any
  ) {
    super(data?.id);
  }
}
