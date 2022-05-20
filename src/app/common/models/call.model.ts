import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const CallModel: {[key: string]: IModel} = {
  ...timestamps,
  startTime: {
    label: 'Start Time',
    type: 'daytime',
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
    type: 'dropdown',
    service: 'callOutcome',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: 'dropdown',
    service: 'callType',
    defaultValue: 'Sales Consultation',
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: 'dropdown',
    service: 'callStatus',
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
