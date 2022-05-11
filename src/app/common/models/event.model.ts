export const EventModel = {
  title: {
    label: 'Title',
    type: String,
    defaultValue: null,
    required: true
  },
  description: {
    label: 'Description',
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
  startTime: {
    label: 'Start Time',
    type: Date,
    defaultValue: null,
    required: true
  },
  endTime: {
    label: 'End Time',
    type: Date,
    defaultValue: null,
    required: true
  },
  type: {
    label: 'Type',
    type: String,
    defaultValue: null,
    required: true
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: null,
    required: false
  },
  dealId: {
    label: 'Deal Id',
    type: String,
    defaultValue: null,
    required: false
  },
  officeId: {
    label: 'Office Id',
    type: String,
    defaultValue: null,
    required: false
  },
  outcome: {
    label: 'Outcome',
    type: String,
    defaultValue: null,
    required: false
  }
}
