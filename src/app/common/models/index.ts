import { CallModel } from './call.model';
import { CampaignModel } from './campaign.model';
import { ContactModel } from './contact.model';
import { DealModel } from './deal.model';
import { EventModel } from './event.model';
import { LeadSourceModel } from './leadSource.model';
import { LeadModel } from './lead.model';
import { Validators } from '@angular/forms';
import { AddressModel } from './address.model';
import { OfficeModel } from './office.model';
import { ICall, ICallDTO, ICampaign, IContact, ICustomField, IDeal, IEvent, ILead, ILeadSource, ISetting, ISettingDTO } from '@trichome/core';

export interface IModel {
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'dropdown' | 'currency' | 'percentage' | 'calendar' | 'timer' | 'both' | 'virtual' | 'timestamp' | 'dropdown-search',
  service?: string;
  defaultValue?: any;
  mandatory?:boolean;
  validators?: Validators[]
}

export const models: {[key: string]: any} = {
  address: AddressModel,
  call: CallModel,
  campaign: CampaignModel,
  deal: DealModel,
  contact: ContactModel,
  event: EventModel,
  lead: LeadModel,
  leadSource: LeadSourceModel,
  office: OfficeModel
}

export type DominionType = ICall
  | ICallDTO
  | ICampaign
  | IDeal
  | IContact
  | IEvent
  | ILead
  | ILeadSource
  | ICustomField
  | ISetting;
