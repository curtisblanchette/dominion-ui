import { Validators } from '@angular/forms';

export const CallModel = {
  startTime: {
    label: 'Start Time',
    type: 'date-picker',
    defaultValue: new Date(),
    validators: [
      Validators.required
    ]
  },
  direction: {
    label: 'Direction',
    type: 'text',
    defaultValue: 'inbound',
    validators: [
      Validators.required
    ]
  },
  outcome: {
    label: 'Outcome',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: 'text',
    defaultValue: 'Sales Consultation',
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: 'text',
    defaultValue: 'Answered',
    validators: [
      Validators.required
    ]
  },
  dialledNumber: {
    label: 'Dialled Number',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  dealId: {
    label: 'Deal Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  description: {
    label: 'Description',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  leadId: {
    label: 'Lead Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  trackingNumber: {
    label: 'Tracking Number',
    type: 'text',
    defaultValue: null,
    validators: []
  }
}
