import { Validators } from '@angular/forms';

export const LeadSourceModel = {
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
