import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleType } from '../../modules/flow/_core/classes/flow.moduleTypes';

export enum Fields {
  TITLE = 'title',
  DESCRIPTION = 'description',
  CONTACT_ID = 'contactId',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  TYPE_ID = 'typeId',
  DEAL_ID = 'dealId',
  OFFICE_ID = 'officeId',
  OUTCOME_ID = 'outcomeId'
}

export const EventModel: {[key: string]: IModel} = {
  ...timestamps,
  [Fields.TITLE]: {
    label: 'Title',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.DESCRIPTION]: {
    label: 'Description',
    type: 'text',
    defaultValue: null,
    validators: [
    ]
  },
  [Fields.CONTACT_ID]: {
    label: 'Contact Id',
    type: 'dropdown-search',
    service: ModuleType.CONTACT,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.START_TIME]: {
    label: 'Start Time',
    type: 'daytime',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.END_TIME]: {
    label: 'End Time',
    type: 'daytime',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.TYPE_ID]: {
    label: 'Type',
    type: 'dropdown',
    service: 'eventType',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  [Fields.DEAL_ID]: {
    label: 'Deal Id',
    type: 'dropdown-search',
    service: ModuleType.DEAL,
    defaultValue: null,
    validators: []
  },
  [Fields.OFFICE_ID]: {
    label: 'Office Id',
    type: 'dropdown',
    defaultValue: null,
    validators: []
  },
  [Fields.OUTCOME_ID]: {
    label: 'Outcome Id',
    type: 'dropdown',
    service: 'eventOutcome',
    defaultValue: null,
    validators: []
  }
}
