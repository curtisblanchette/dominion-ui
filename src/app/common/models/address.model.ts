import { Validators } from '@angular/forms';
import { IModel } from './index';

export enum Fields {
  LINE1 = 'line1',
  LINE2 = 'line2',
  UNIT = 'unit',
  CITY = 'city',
  STATE_CODE = 'stateCode',
  ZIP_CODE = 'zipCode',
  COUNTRY_CODE = 'countryCode'
}

export const AddressModel: { [key: string]: IModel } = {
  [Fields.LINE1]: {
    label: 'Line 1',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.LINE2]: {
    label: 'Line 2',
    type: 'text',
    defaultValue: '',
    validators: [
    ]
  },
  [Fields.UNIT]: {
    label: 'Unit',
    type: 'text',
    defaultValue: '',
    validators: [
    ]
  },
  [Fields.CITY]: {
    label: 'City',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.STATE_CODE]: {
    label: 'State Code',
    type: 'dropdown-search',
    service : 'state',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.COUNTRY_CODE]: {
    label: 'Country Code',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  },
  [Fields.ZIP_CODE]: {
    label: 'Zip Code',
    type: 'text',
    defaultValue: '',
    validators: [
      Validators.required
    ]
  }
}
