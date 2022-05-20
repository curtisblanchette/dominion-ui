import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const EventModel: {[key: string]: IModel} = {
  ...timestamps,
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
    type: 'daytime',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  endTime: {
    label: 'End Time',
    type: 'daytime',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  typeId: {
    label: 'Type',
    type: 'dropdown',
    service: 'eventType',
    defaultValue: null,
    validators: [
      Validators.required
    ]
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
  outcomeId: {
    label: 'Outcome Id',
    type: 'dropdown',
    service: 'eventOutcome',
    defaultValue: null,
    validators: []
  }
}
