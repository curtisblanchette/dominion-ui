import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const ContactModel: {[key: string]: IModel} = {
  ...timestamps,
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
  fullName: {
    label: 'Full Name',
    type: 'virtual'
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
