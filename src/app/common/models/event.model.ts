import { Validators } from '@angular/forms';

export const EventModel = {
  title: {
    label: 'Title',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  description: {
    label: 'Description',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  contactId: {
    label: 'Contact Id',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  startTime: {
    label: 'Start Time',
    type: Date,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  endTime: {
    label: 'End Time',
    type: Date,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadId: {
    label: 'Lead Id',
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
  officeId: {
    label: 'Office Id',
    type: String,
    defaultValue: null,
    validators: []
  },
  outcome: {
    label: 'Outcome',
    type: String,
    defaultValue: null,
    validators: []
  }
}
