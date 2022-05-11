import { Validators } from '@angular/forms';

export const DealModel = {
  name: {
    label: 'Name',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  practiceArea: {
    label: 'Practice Area',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  contactId: {
    label: 'Contact Id',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  campaignId: {
    label: 'Campaign Id',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  stage: {
    label: 'State',
    type: String,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  noSetOn: {
    label: 'No Set On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  setAppointmentOn: {
    label: 'Set Appointment On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  noShowOn: {
    label: 'No Show On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  hireScheduledOn: {
    label: 'Hire Scheduled On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  noHireOn: {
    label: 'No Hire On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  hiredOn: {
    label: 'Hired On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  unqualifiedOn: {
    label: 'Unqualified On',
    type: Date,
    defaultValue: null,
    validators: []
  },
  lostOn: {
    label: 'Lost On',
    type: Date,
    defaultValue: null,
    validators: []
  }
}
