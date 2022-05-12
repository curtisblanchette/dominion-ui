import { CallModel } from './call.model';
import { CampaignModel } from './campaign.model';
import { ContactModel } from './contact.model';
import { DealModel } from './deal.model';
import { EventModel } from './event.model';
import { LeadSourceModel } from './leadSource.model';
import { LeadModel } from './lead.model';
import { Call, Campaign, Contact, Deal, Event, ICall, ICallDTO, ICampaign, ICampaignDTO, IContact, IContactDTO, IDeal, IDealDTO, IEvent, IEventDTO, ILead, ILeadDTO, ILeadSource, ILeadSourceDTO, Lead, LeadSource } from '@4iiz/corev2';

export const models = {
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
  LeadSource | ILeadSource | ILeadSourceDTO;
