export const LeadModel = {
  firstName: {
    label: 'First Name',
    type: String,
    defaultValue: null,
    required: true
  },
  lastName: {
    label: 'Last Name',
    type: String,
    defaultValue: null,
    required: true
  },
  phone: {
    label: 'Phone Number',
    type: String,
    defaultValue: null,
    required: true
  },
  email: {
    label: 'Email Address',
    type: String,
    defaultValue: null,
    required: true
  },
  state: {
    label: 'State',
    type: String,
    defaultValue: null,
    required: true
  },
  practiceAreaId: {
    label: 'Practice Area Id',
    type: Number,
    defaultValue: null,
    required: true
  },
  campaignId: {
    label: 'Campaign Id',
    type: String,
    defaultValue: null,
    required: false
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: String,
    defaultValue: null,
    required: false
  },
}
