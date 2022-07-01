import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleTypes } from '../../data/entity-metadata';
import { FiizValidators } from '../validators';

export enum Fields {
  START_TIME = 'startTime',
  DIRECTION = 'direction',
  OUTCOME_ID = 'outcomeId',
  TYPE_ID = 'typeId',
  STATUS_ID = 'statusId',
  DIALLED_NUMBER = 'dialledNumber',
  DEAL_ID = 'dealId',
  DESCRIPTION = 'description',
  LEAD_ID = 'leadId',
  TRACKING_NUMBER = 'trackingNumber',
  OBJECTION_ID = 'objectionId'
}

export const CallModel: {[key: string]: IModel} = {
  ...timestamps,
  [Fields.START_TIME]: {
    label: 'Start Time',
    type: 'both',
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
  [Fields.OUTCOME_ID]: {
    label: 'Outcome',
    type: 'dropdown',
    service: 'callOutcome',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.TYPE_ID]: {
    label: 'Type',
    type: 'dropdown',
    service: 'callType',
    defaultValue: 'Sales Consultation',
    validators: [
      Validators.required
    ]
  },
  [Fields.STATUS_ID]: {
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
      FiizValidators.e164
    ]
  },
  [Fields.DEAL_ID]: {
    label: 'Deal Id',
    type: 'dropdown-search',
    service: ModuleTypes.DEAL,
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
    type: 'dropdown-search',
    service: ModuleTypes.LEAD,
    defaultValue: null,
    validators: []
  },
  [Fields.TRACKING_NUMBER]: {
    label: 'Tracking Number',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.OBJECTION_ID]: {
    label: 'Objection',
    type: 'dropdown',
    service: 'callObjection',
    defaultValue: null,
    validators: []
  }
}
