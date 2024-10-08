import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { FiizValidators } from '../validators';
import { LookupTypes, ModuleTypes } from '../../data/entity-metadata';

export enum Fields {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  PHONE = 'phone',
  EMAIL = 'email',
  STATUS_ID = 'statusId',
  LOST_REASON_ID = 'lostReasonId',
  STATE = 'state',
  PRACTICE_AREA_ID = 'practiceAreaId',
  CAMPAIGN_ID = 'campaignId',
  LEAD_SOURCE_ID = 'leadSourceId',
}

export enum VirtualFields {
  FULL_NAME = 'fullName',
}

export const LeadModel: {[key: string]: IModel} = {
  ...timestamps,
  [Fields.FIRST_NAME]: {
    label: 'First Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.LAST_NAME]: {
    label: 'Last Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [VirtualFields.FULL_NAME]: {
    label: 'Full Name',
    type: 'virtual'
  },
  [Fields.PHONE]: {
    label: 'Phone Number',
    type: 'tel',
    defaultValue: null,
    validators: [
      Validators.required,
      FiizValidators.e164
    ]
  },
  [Fields.EMAIL]: {
    label: 'Email Address',
    type: 'email',
    defaultValue: null,
    validators: [
      Validators.email
    ]
  },
  [Fields.STATUS_ID]: {
    label: 'Status',
    type: 'dropdown-search',
    service: LookupTypes.LEAD_STATUS,
    defaultValue: 'No Set',
    validators: [
      Validators.required
    ]
  },
  [Fields.LOST_REASON_ID]: {
    label: 'Lost: Reason',
    type: 'dropdown-search',
    service: 'lostReason',
    defaultValue: null
  },
  [Fields.STATE]: {
    label: 'State',
    type: 'dropdown-search',
    service: LookupTypes.STATE,
    defaultValue: null,
    validators: []
  },
  [Fields.PRACTICE_AREA_ID]: {
    label: 'Practice Area',
    type: 'dropdown-search',
    service: LookupTypes.PRACTICE_AREA,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.CAMPAIGN_ID]: {
    label: 'Campaign Id',
    type: 'dropdown-search',
    service: ModuleTypes.CAMPAIGN,
    defaultValue: null,
    validators: []
  },
  [Fields.LEAD_SOURCE_ID]: {
    label: 'Lead Source Id',
    type: 'dropdown-search',
    service: ModuleTypes.LEAD_SOURCE,
    defaultValue: null,
    validators: []
  },
}
