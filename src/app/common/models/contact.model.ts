import { Validators } from '@angular/forms';

export const ContactModel = {
  firstName: {
    label: 'First Name',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  lastName: {
    label: 'Last Name',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  phone: {
    label: 'Phone',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  email: {
    label: 'Email',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  }
}
