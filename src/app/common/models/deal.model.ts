import { Validators } from '@angular/forms';
import { IModel } from './index';
import { timestamps } from './_timestamps.model';
import { ModuleTypes } from '../../data/entity-metadata';
import dayjs from 'dayjs';

export enum Fields {
  NAME = 'name',
  STAGE_ID = 'stageId',
  LOST_REASON_ID = 'lostReasonId',
  PRACTICE_AREA_ID = 'practiceAreaId',
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
    type: 'dropdown-search',
    service: 'dealStage',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  lostReasonId: {
    label: 'Lost: Reason',
    type: 'dropdown-search',
    service: 'lostReason',
    defaultValue: null
  },
  practiceAreaId: {
    label: 'Practice Area',
    type: 'dropdown-search',
    service: 'practiceArea',
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  // contactId: {
  //   label: 'Contact Id',
  //   type: 'dropdown-search',
  //   service: ModuleTypes.CONTACT,
  //   defaultValue: null,
  //   validators: [
  //   ]
  // },
  campaignId: {
    label: 'Campaign Id',
    type: 'dropdown-search',
    service: ModuleTypes.CAMPAIGN,
    defaultValue: null,
    validators: [
    ]
  },
  leadSourceId: {
    label: 'Lead Source Id',
    type: 'dropdown-search',
    service: ModuleTypes.LEAD_SOURCE,
    defaultValue: null,
    validators: [
    ]
  },
  leadId: {
    label: 'Lead Id',
    type: 'dropdown-search',
    service: ModuleTypes.LEAD,
    defaultValue: null,
    validators: [
      Validators.required
    ]
  },
  scheduledCallBack: {
    label: 'Scheduled Call Back',
    type: 'both',
    // defaultValue: dayjs().format(),
  },
  score: {
    label: 'Score',
    type: 'number',
    defaultValue: 100
  },
}
