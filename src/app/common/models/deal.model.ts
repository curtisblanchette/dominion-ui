import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';

export const DealModel: {[key: string]: IModel} = {
  ...timestamps,
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  stageId: {
    label: 'Stage',
    type: 'dropdown',
    service: 'dealStage',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  lostReasonId: {
    label: 'Lost: Reason',
    type: 'dropdown',
    service: 'lostReason',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  practiceAreaId: {
    label: 'Practice Area',
    type: 'dropdown',
    service: 'practiceArea',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  contactId: {
    label: 'Contact Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  campaignId: {
    label: 'Campaign Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  noSetOn: {
    label: 'No Set On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  setAppointmentOn: {
    label: 'Set Appointment On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  noShowOn: {
    label: 'No Show On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  hireScheduledOn: {
    label: 'Hire Scheduled On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  noHireOn: {
    label: 'No Hire On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  hiredOn: {
    label: 'Hired On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  unqualifiedOn: {
    label: 'Unqualified On',
    type: 'day',
    defaultValue: null,
    validators: []
  },
  lostOn: {
    label: 'Lost On',
    type: 'day',
    defaultValue: null,
    validators: []
  }
}
