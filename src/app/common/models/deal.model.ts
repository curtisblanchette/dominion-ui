import { Validators } from '@angular/forms';

export const DealModel = {
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  practiceArea: {
    label: 'Practice Area',
    type: 'text',
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
  stage: {
    label: 'State',
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
