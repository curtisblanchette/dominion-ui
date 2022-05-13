import { Validators } from '@angular/forms';
import { IModel } from './index';

export const LeadModel: {[key: string]: IModel} = {
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
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  email: {
    label: 'Email Address',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: 'text',
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
    label: 'Practice Area Id',
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
