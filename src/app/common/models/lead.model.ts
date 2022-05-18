import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const LeadModel: {[key: string]: IModel} = {
  ...timestamps,
  firstName: {
    label: 'First Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  fullName: {
    label: 'Full Name',
    type: 'virtual'
  },
  phone: {
    label: 'Phone Number',
    type: 'tel',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  email: {
    label: 'Email Address',
    type: 'email',
    defaultValue: null,
    validators: [
      Validators.required,
      Validators.email
    ]
  },
  statusId: {
    label: 'Status',
    type: 'dropdown',
    service: 'leadStatus',
    defaultValue: 'No Set',
    validators: [
      Validators.required
    ]
  },
  state: {
    label: 'State',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  practiceAreaId: {
    label: 'Practice Area',
    type: 'dropdown',
    service: 'practiceArea',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  campaignId: {
    label: 'Campaign Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
}
