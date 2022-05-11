import { Validators } from '@angular/forms';

export const LeadSourceModel = {
  name: {
    label: 'Name',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  channel: {
    label: 'Channel',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  }
}
