import { FlowBaseModel } from './flow.baseModel';
import { ModuleTypes } from '../../../data/entity-metadata';
import { EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { DominionType } from '../../../common/models';

export class FlowBotAction extends FlowBaseModel{
  public name: string;
  public icon: string;
  public module: ModuleTypes;
  public operation: 'add' | 'update';
  public status: FlowBotActionStatus;
  public message: string;
  public response?: any;
  public errorMessage?: string;

  private service: EntityCollectionService<DominionType>;

  payload: any;

  constructor(
    private entityCollectionServiceFactory: EntityCollectionServiceFactory,
    data: any
  ) {
    super(data?.id);
    // defaults
    this.status = FlowBotActionStatus.INITIAL;
    // layer on customizations
    Object.assign(this, data);

    // create a service for this action
    this.service = this.entityCollectionServiceFactory.create(this.module);
  }

  async execute() {
    this.status = FlowBotActionStatus.PENDING;
    return this.service[this.operation](this.payload).toPromise().then(res => {
      delete this.errorMessage;
      this.response = res;
      this.status = FlowBotActionStatus.SUCCESS;
      this.message = `${this.getModuleName(this.module)} ${this.operation === 'add' ? 'Created' : 'Updated'}.`;

      // set the entityCollection filter to target this record going forward
      this.service.setFilter({id: this.response?.id});

      return res;
    }).catch(e => {
      delete this.response;
      this.errorMessage = e.message;
      this.status = FlowBotActionStatus.FAILURE;
      throw e;
    });
  }

  private getModuleName(module: ModuleTypes) {
    if (module) {
      return module[0].toUpperCase() + module.substring(1, module.length);
    }
  }
}

export enum FlowBotActionStatus {
  INITIAL = 'initial',
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILURE = 'failure'
}
