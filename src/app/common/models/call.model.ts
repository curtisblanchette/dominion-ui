export const CallModel = {
  startTime: {
    type: Date,
    defaultValue: new Date(),
    required: true
  },
  direction: {
    label: 'Direction',
    type: String,
    defaultValue: 'inbound',
    required: true
  },
  outcome: {
    label: 'Outcome',
    type: String,
    defaultValue: null,
    required: true
  },
  type: {
    label: 'Type',
    type: String,
    defaultValue: 'Sales Consultation',
    required: true,
  },
  status: {
    label: 'Status',
    type: String,
    defaultValue: 'Answered',
    required: true
  },
  dialledNumber: {
    label: 'Dialled Number',
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
  description: {
    label: 'Description',
    type: String,
    defaultValue: null,
    required: false
  },
  leadId: {
    label: 'Lead Id',
    type: String,
    defaultValue: null,
    required: false
  },
  trackingNumber: {
    label: 'Tracking Number',
    type: String,
    defaultValue: null,
    required: false
  }
}
