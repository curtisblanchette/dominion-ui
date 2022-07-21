import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleTypes } from '../../data/entity-metadata';

export const CampaignModel: {[key: string]: IModel} = {
  ...timestamps,
  name: {
    label: 'Name',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  status: {
    label: 'Status',
    type: 'text',
    defaultValue: 'active',
    validators: [
      Validators.required
    ]
  },
  audience: {
    label: 'Audience',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  type: {
    label: 'Type',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  trackingNumber: {
    label: 'Tracking Number',
    type: 'text',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  startDate: {
    label: 'Start Date',
    type: 'calendar',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  endDate: {
    label: 'End Date',
    type: 'calendar',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'dropdown-search',
    service: ModuleTypes.LEAD_SOURCE,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  }
}
