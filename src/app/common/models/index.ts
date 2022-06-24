import { CallModel } from './call.model';
import { CampaignModel } from './campaign.model';
import { ContactModel } from './contact.model';
import { DealModel } from './deal.model';
import { EventModel } from './event.model';
import { LeadSourceModel } from './leadSource.model';
import { LeadModel } from './lead.model';
import { Address, Call, Campaign, Contact, Deal, Event, ICall, ICallDTO, ICampaign, ICampaignDTO, IContact, IContactDTO, IDeal, IDealDTO, IEvent, IEventDTO, ILead, ILeadDTO, ILeadSource, ILeadSourceDTO, Lead, LeadSource, LK_PracticeArea, Office } from '@4iiz/corev2';
import { Validators } from '@angular/forms';
import { DropdownItem } from '../components/ui/forms';
import { AddressModel } from './address.model';
import { OfficeModel } from './office.model';

export interface IModel {
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'dropdown' | 'currency' | 'percentage' | 'day' | 'daytime' | 'virtual' | 'timestamp' | 'dropdown-search',
  service?: string;
  defaultValue?: any;
  validators?: Validators[]
}

// const defaultListColumns: {[key: string]: string[]} = {
//   address: ['line1', 'city', 'zipCode', 'stateCode', 'countryCode'],
//   call: ['type', 'direction', 'outcomeId', 'status', 'dialledNumber', 'createdAt'],
//   campaign: ['name', 'createdAt'],
//   deal: ['name', 'stage', 'contactId', 'createdAt'],
//   contact: ['fullName', 'phone', 'email', 'createdAt'],
//   event: ['title', 'type', 'startTime', 'endTime', 'createdAt'],
//   lead: ['fullName', 'phone', 'email', 'createdAt'],
//   leadSource: ['name', 'status', 'createdAt', 'channel'],
//   office: ['name']
// }

// export const getColumnsForModule = (module: string): DropdownItem[] => {
//   const columns = [];
//   for(const [key, value] of Object.entries(models[module]) ) {
//     if(defaultListColumns[module].includes(key)) {
//       columns.push({id: key, label: (<any>value).label});
//     }
//   }
//   return columns;
// }

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
  Call | ICall | ICallDTO |
  Campaign | ICampaign | ICampaignDTO |
  Deal | IDeal | IDealDTO |
  Contact | IContact | IContactDTO |
  Event | IEvent | IEventDTO |
  Lead | ILead | ILeadDTO |
  LeadSource | ILeadSource | ILeadSourceDTO |
  LK_PracticeArea;
