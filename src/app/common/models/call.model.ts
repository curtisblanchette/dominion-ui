import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { phoneValidation } from '../../common/custom.validations';

export enum Fields {
  START_TIME = 'startTime',
  DIRECTION = 'direction',
  OUTCOME = 'outcome',
  TYPE = 'type',
  STATUS = 'status',
  DIALLED_NUMBER = 'dialledNumber',
  DEAL_ID = 'dealId',
  DESCRIPTION = 'description',
  LEAD_ID = 'leadId',
  TRACKING_NUMBER = 'trackingNumber',
  OBJECTION = 'objection'
}

export const CallModel: {[key: string]: IModel} = {
  ...timestamps,
  [Fields.START_TIME]: {
    label: 'Start Time',
    type: 'daytime',
    defaultValue: new Date(),
    validators: [
      Validators.required
    ]
  },
  [Fields.DIRECTION]: {
    label: 'Direction',
    type: 'text',
    defaultValue: 'inbound',
    validators: [
      Validators.required
    ]
  },
  [Fields.OUTCOME]: {
    label: 'Outcome',
    type: 'dropdown',
    service: 'callOutcome',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.TYPE]: {
    label: 'Type',
    type: 'dropdown',
    service: 'callType',
    defaultValue: 'Sales Consultation',
    validators: [
      Validators.required
    ]
  },
  [Fields.STATUS]: {
    label: 'Status',
    type: 'dropdown',
    service: 'callStatus',
    defaultValue: 'Answered',
    validators: [
      Validators.required
    ]
  },
  [Fields.DIALLED_NUMBER]: {
    label: 'Dialled Number',
    type: 'tel',
    defaultValue: null,
    validators: [
      phoneValidation
    ]
  },
  [Fields.DEAL_ID]: {
    label: 'Deal Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.DESCRIPTION]: {
    label: 'Description',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.LEAD_ID]: {
    label: 'Lead Id',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.TRACKING_NUMBER]: {
    label: 'Tracking Number',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.OBJECTION]: {
    label: 'Objection',
    type: 'dropdown',
    service: 'callObjection',
    defaultValue: null,
    validators: []
  }
}
