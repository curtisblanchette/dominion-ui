import { Validators } from '@angular/forms';
import { IModel } from './index';

export const DealModel: {[key: string]: IModel} = {
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  stage: {
    label: 'Stage',
    type: 'dropdown',
    service: 'dealStage',
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
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  setAppointmentOn: {
    label: 'Set Appointment On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  noShowOn: {
    label: 'No Show On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  hireScheduledOn: {
    label: 'Hire Scheduled On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  noHireOn: {
    label: 'No Hire On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  hiredOn: {
    label: 'Hired On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  unqualifiedOn: {
    label: 'Unqualified On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  },
  lostOn: {
    label: 'Lost On',
    type: 'date-picker',
    defaultValue: null,
    validators: []
  }
}
