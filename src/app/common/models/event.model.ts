import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export enum Fields {
  TITLE = 'title',
  DESCRIPTION = 'description',
  CONTACT_ID = 'contactId',
  START_TIME = 'startTime',
  END_TIME = 'endTime',
  TYPE_ID = 'typeId',
  DEAL_ID = 'dealId',
  OFFICE_ID = 'officeId',
  OUTCOME_ID = 'outcomeId',
  OBJECTION_ID = 'objectionId'
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
    label: 'Contact',
    type: 'text',
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
    label: 'Deal',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.OFFICE_ID]: {
    label: 'Office',
    type: 'text',
    defaultValue: null,
    validators: []
  },
  [Fields.OUTCOME_ID]: {
    label: 'Outcome',
    type: 'dropdown',
    service: 'eventOutcome',
    defaultValue: null,
    validators: []
  },
  [Fields.OBJECTION_ID]: {
    label: 'Objection',
    type: 'dropdown',
    service: 'eventObjection',
    defaultValue: null,
    validators: []
  }
}
