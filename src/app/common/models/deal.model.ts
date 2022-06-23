import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleType } from '../../modules/flow/_core/classes/flow.moduleTypes';

export enum Fields {
  NAME = 'name',
  STAGE_ID = 'stageId',
  LOST_REASON_ID = 'lostReasonId',
  PRACTICE_AREA_ID = 'practiceAreaId',
  CONTACT_ID = 'contactId',
  CAMPAIGN_ID = 'campaignId',
  LEAD_SOURCE_ID = 'leadSourceId',
  LEAD_ID = 'leadId',
}

export enum VirtualFields {

}

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
    type: 'dropdown-search',
    service: ModuleType.CONTACT,
    defaultValue: null,
    validators: [
    ]
  },
  campaignId: {
    label: 'Campaign Id',
    type: 'dropdown-search',
    service: ModuleType.CAMPAIGN,
    defaultValue: null,
    validators: [
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'dropdown-search',
    service: ModuleType.LEAD_SOURCE,
    defaultValue: null,
    validators: [
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: 'dropdown-search',
    service: ModuleType.LEAD,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  }
}
