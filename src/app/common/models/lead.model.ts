import { Validators } from '@angular/forms';

export const LeadModel = {
  firstName: {
    label: 'First Name',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  lastName: {
    label: 'Last Name',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  phone: {
    label: 'Phone Number',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  email: {
    label: 'Email Address',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  state: {
    label: 'State',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  practiceAreaId: {
    label: 'Practice Area Id',
    type: Number,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  campaignId: {
    label: 'Campaign Id',
    type: String,
    defaultValue: null,
    validators: []
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: String,
    defaultValue: null,
    validators: []
  },
}
