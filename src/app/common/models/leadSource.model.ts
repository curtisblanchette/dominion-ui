import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const LeadSourceModel: {[key: string]: IModel} = {
  ...timestamps,
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
    defaultValue: 'active',
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
