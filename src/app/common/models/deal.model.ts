export const DealModel = {
  name: {
    label: 'Name',
    type: String,
    defaultValue: null,
    required: true
  },
  practiceArea: {
    label: 'Practice Area',
    type: String,
    defaultValue: null,
    required: true
  },
  contactId: {
    label: 'Contact Id',
    type: String,
    defaultValue: null,
    required: true
  },
  campaignId: {
    label: 'Campaign Id',
    type: String,
    defaultValue: null,
    required: true
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: String,
    defaultValue: null,
    required: true
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: null,
    required: true
  },
  stage: {
    label: 'State',
    type: String,
    defaultValue: null,
    required: true
  },
  noSetOn: {
    label: 'No Set On',
    type: Date,
    defaultValue: null,
    required: false
  },
  setAppointmentOn: {
    label: 'Set Appointment On',
    type: Date,
    defaultValue: null,
    required: false
  },
  noShowOn: {
    label: 'No Show On',
    type: Date,
    defaultValue: null,
    required: false
  },
  hireScheduledOn: {
    label: 'Hire Scheduled On',
    type: Date,
    defaultValue: null,
    required: false
  },
  noHireOn: {
    label: 'No Hire On',
    type: Date,
    defaultValue: null,
    required: false
  },
  hiredOn: {
    label: 'Hired On',
    type: Date,
    defaultValue: null,
    required: false
  },
  unqualifiedOn: {
    label: 'Unqualified On',
    type: Date,
    defaultValue: null,
    required: false
  },
  lostOn: {
    label: 'Lost On',
    type: Date,
    defaultValue: null,
    required: false
  }
}
