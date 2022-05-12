import { Validators } from '@angular/forms';

export const LeadModel = {
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
    type: 'number',
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
