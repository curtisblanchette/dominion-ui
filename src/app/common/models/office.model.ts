import { Validators } from '@angular/forms';
import { IModel } from './index';
import { ModuleTypes } from '../../data/entity-metadata';

export enum Fields {
  NAME = 'name',
  ADDRESS_ID = 'addressId'
}

export const OfficeModel: { [key: string]: IModel } = {
  [Fields.NAME]: {
    label: 'Office Name',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.ADDRESS_ID]: {
    label: 'Address',
    type: 'dropdown-search',
    service: ModuleTypes.ADDRESS,
    defaultValue: null,
    validators : []
  }
}
