import { Validators } from '@angular/forms';

export const ContactModel = {
  firstName: {
    label: 'First Name',
    type: String,
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  lastName: {
    label: 'Last Name',
    type: String,
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  phone: {
    label: 'Phone',
    type: String,
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  email: {
    label: 'Email',
    type: String,
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: '',
    validators: [
      Validators.required
    ]
  }
}
