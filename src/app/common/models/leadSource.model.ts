import { Validators } from '@angular/forms';
import { IModel } from './index';

export const LeadSourceModel: {[key: string]: IModel} = {
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  channel: {
    label: 'Channel',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  }
}
