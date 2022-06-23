import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleType } from '../../modules/flow/_core/classes/flow.moduleTypes';
import { phoneValidation } from '../../common/custom.validations';

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
      phoneValidation
    ]
  },
  [Fields.EMAIL]: {
    label: 'Email Address',
    type: 'email',
    defaultValue: null,
    validators: [
      Validators.required,
      Validators.email
    ]
  },
  [Fields.STATUS_ID]: {
    label: 'Status',
    type: 'dropdown',
    service: 'leadStatus',
    defaultValue: 'No Set',
    validators: [
      Validators.required
    ]
  },
  [Fields.LOST_REASON_ID]: {
    label: 'Lost: Reason',
    type: 'dropdown',
    service: 'lostReason',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.STATE]: {
    label: 'State',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.PRACTICE_AREA_ID]: {
    label: 'Practice Area',
    type: 'dropdown',
    service: 'practiceArea',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.CAMPAIGN_ID]: {
    label: 'Campaign Id',
    type: 'dropdown-search',
    service: ModuleType.CAMPAIGN,
    defaultValue: null,
    validators: []
  },
  [Fields.LEAD_SOURCE_ID]: {
    label: 'Lead Source Id',
    type: 'dropdown-search',
    service: ModuleType.LEAD_SOURCE,
    defaultValue: null,
    validators: []
  },
}
