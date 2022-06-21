import { Validators } from '@angular/forms';
import { IModel } from './index';

export enum Fields {
  NAME = 'name'
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
}
