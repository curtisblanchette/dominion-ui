import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleTypes } from '../../data/entity-metadata';
import { FiizValidators } from '../validators';

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
  [Fields.OBJECTION]: {
    label: 'Objection',
    type: 'dropdown',
    service: 'callObjection',
    defaultValue: null,
    validators: []
  }
}
