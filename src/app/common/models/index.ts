import { CallModel } from './call.model';
import { CampaignModel } from './campaign.model';
import { ContactModel } from './contact.model';
import { DealModel } from './deal.model';
import { EventModel } from './event.model';
import { LeadSourceModel } from './leadSource.model';
import { LeadModel } from './lead.model';
import { Call, Campaign, Contact, Deal, Event, ICall, ICallDTO, ICampaign, ICampaignDTO, IContact, IContactDTO, IDeal, IDealDTO, IEvent, IEventDTO, ILead, ILeadDTO, ILeadSource, ILeadSourceDTO, IPracticeAreaDTO, Lead, LeadSource, LK_PracticeArea } from '@4iiz/corev2';
import { Validators } from '@angular/forms';
import { IPracticeArea } from '@4iiz/corev2/dist/models/client/PracticeArea/PracticeArea';
import { DropdownItem } from '../components/ui/forms';

export interface IModel {
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'number' | 'dropdown' | 'currency' | 'percentage' | 'day' | 'daytime' | 'virtual' | 'timestamp',
  service?: string;
  defaultValue?: any;
  validators?: Validators[]
}

const defaultListColumns: {[key: string]: string[]} = {
  call: ['type', 'direction', 'outcome', 'status', 'dialledNumber', 'createdAt'],
  campaign: ['name', 'createdAt'],
  deal: ['name', 'stage', 'contactId', 'createdAt'],
  contact: ['fullName', 'phone', 'email', 'createdAt'],
  event: ['title', 'type', 'startTime', 'endTime', 'createdAt'],
  lead: ['fullName', 'phone', 'email', 'createdAt'],
  leadSource: ['name', 'status', 'createdAt', 'channel']
}

export const getColumnsForModule = (module: string): DropdownItem[] => {
  const columns = [];
  for(const [key, value] of Object.entries(models[module]) ) {
    if(defaultListColumns[module].includes(key)) {
      columns.push({id: key, label: (<any>value).label});
    }
  }
  return columns;
}

export const models: {[key: string]: any} = {
  call: CallModel,
  campaign: CampaignModel,
  deal: DealModel,
  contact: ContactModel,
  event: EventModel,
  lead: LeadModel,
  leadSource: LeadSourceModel
}

export const types: {[key: string]: any} = {
  call: Call,
  campaign: Campaign,
  deal: Deal,
  contact: Contact,
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
  LK_PracticeArea | IPracticeArea | IPracticeAreaDTO;
