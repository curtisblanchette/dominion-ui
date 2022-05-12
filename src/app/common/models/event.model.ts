import { Validators } from '@angular/forms';
import { IModel } from './index';

export const EventModel: {[key: string]: IModel} = {
  title: {
    label: 'Title',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  description: {
    label: 'Description',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  contactId: {
    label: 'Contact Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  startTime: {
    label: 'Start Time',
    type: 'date-picker',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  endTime: {
    label: 'End Time',
    type: 'date-picker',
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
  leadId: {
    label: 'Lead Id',
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
  officeId: {
    label: 'Office Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  outcome: {
    label: 'Outcome',
    type: 'text',
    defaultValue: null,
    validators: []
  }
}
