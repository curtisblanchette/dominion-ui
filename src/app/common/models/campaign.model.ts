import { Validators } from '@angular/forms';

export const CampaignModel = {
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
    inputType: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  audience: {
    label: 'Audience',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  trackingNumber: {
    label: 'Tracking Number',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  startDate: {
    label: 'Start Date',
    type: 'date-picker',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  endDate: {
    label: 'End Date',
    type: 'date-picker',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  }
}
