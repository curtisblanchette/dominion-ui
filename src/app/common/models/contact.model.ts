import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { FiizValidators } from '../validators';
import { ModuleTypes } from '../../data/entity-metadata';

export enum Fields {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  PHONE = 'phone',
  EMAIL = 'email',
  LEAD_ID = 'leadId'
}

export enum VirtualFields {
  FULL_NAME = 'fullName'
}

export const ContactModel: { [key: string]: IModel } = {
  ...timestamps,
  [Fields.FIRST_NAME]: {
    label: 'First Name',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.LAST_NAME]: {
    label: 'Last Name',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [VirtualFields.FULL_NAME]: {
    label: 'Full Name',
    type: 'virtual'
  },
  [Fields.PHONE]: {
    label: 'Phone',
    type: 'tel',
    defaultValue: '',
    validators: [
      Validators.required,
      FiizValidators.e164
    ]
  },
  [Fields.EMAIL]: {
    label: 'Email',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required,
      Validators.email
    ]
  },
  // [Fields.LEAD_ID]: {
  //   label: 'Lead Id',
  //   type: 'dropdown-search',
  //   service: ModuleTypes.LEAD,
  //   defaultValue: '',
  //   validators: [
  //   ]
  // }
}
