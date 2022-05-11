import { Validators } from '@angular/forms';

export const CallModel = {
  startTime: {
    type: Date,
    defaultValue: new Date(),
    validators: [
      Validators.required
    ]
  },
  direction: {
    label: 'Direction',
    type: String,
    defaultValue: 'inbound',
    validators: [
      Validators.required
    ]
  },
  outcome: {
    label: 'Outcome',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: String,
    defaultValue: 'Sales Consultation',
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: String,
    defaultValue: 'Answered',
    validators: [
      Validators.required
    ]
  },
  dialledNumber: {
    label: 'Dialled Number',
    type: String,
    defaultValue: null,
    validators: []
  },
  dealId: {
    label: 'Deal Id',
    type: String,
    defaultValue: null,
    validators: []
  },
  description: {
    label: 'Description',
    type: String,
    defaultValue: null,
    validators: []
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: null,
    validators: []
  },
  trackingNumber: {
    label: 'Tracking Number',
    type: String,
    defaultValue: null,
    validators: []
  }
}
