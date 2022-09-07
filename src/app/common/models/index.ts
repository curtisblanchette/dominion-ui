import { CallModel } from './call.model';
import { CampaignModel } from './campaign.model';
import { ContactModel } from './contact.model';
import { DealModel } from './deal.model';
import { EventModel } from './event.model';
import { LeadSourceModel } from './leadSource.model';
import { LeadModel } from './lead.model';
import { Address, Call, Call_Note, Campaign, Contact, Deal, Event, Event_Note, ICall, ICallDTO, ICallNoteDTO, ICampaign, ICampaignDTO, IContact, IContactDTO, IDeal, IDealDTO, IEvent, IEventDTO, IEventNoteDTO, ILead, ILeadDTO, ILeadSource, ILeadSourceDTO, Lead, LeadSource, LK_PracticeArea, Office } from '@4iiz/corev2';
import { Validators } from '@angular/forms';
import { AddressModel } from './address.model';
import { OfficeModel } from './office.model';

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

export const types: {[key: string]: any} = {
  address: Address,
  call: Call,
  campaign: Campaign,
  deal: Deal,
  contact: Contact,
  office: Office,
  event: Event,
  lead: Lead,
  leadSource: LeadSource
}

export type DominionType =
  Call | ICall | ICallDTO | Call_Note | ICallNoteDTO |
  Campaign | ICampaign | ICampaignDTO |
  Deal | IDeal | IDealDTO |
  Contact | IContact | IContactDTO |
  Event | IEvent | IEventDTO | Event_Note | IEventNoteDTO |
  Lead | ILead | ILeadDTO |
  LeadSource | ILeadSource | ILeadSourceDTO |
  LK_PracticeArea;
