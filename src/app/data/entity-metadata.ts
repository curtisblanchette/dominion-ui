import { EntityMetadataMap, QueryParams } from '@ngrx/data';
import { Call, Campaign, Contact, Deal, Event, Lead, LeadSource } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {
    // filterFn: (entities: Lead[], pattern: { q: string } ) => {
    //   if(pattern.q) {
    //     return entities.filter((entity: any) => {
    //       const fields = [
    //         entity.firstName.toLowerCase(),
    //         entity.lastName.toLowerCase(),
    //         entity.phone.toLowerCase(),
    //         entity.email.toLowerCase()
    //       ];
    //       return fields.find(field => field.includes(pattern.q));
    //     })
    //   }
    //   return entities;
    //
    // },
  },
  call: {},
  deal: {},
  event: {},
  campaign: {},
  leadSource: {},

  role: {},
  practiceArea: {},
  leadStatus: {},
  callOutcome: {},
  callStatus: {},
  callType: {},
  dealStage: {},
  eventOutcome: {},
  eventType: {}
};


export const pluralNames = {
  contact: 'contacts',
  lead: 'leads',
  deal: 'deals',
  call: 'calls',
  event: 'events',
  campaign: 'campaigns',
  leadSource: 'leadSources',

  role: 'roles',
  practiceArea: 'practiceAreas',
  leadStatus: 'leadStatuses',
  callOutcome: 'callOutcomes',
  callType: 'callTypes',
  callStatus: 'callStatuses',
  dealStage: 'dealStages',
  eventOutcome: 'eventOutcomes',
  eventType: 'eventType'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}

export const uriOverrides: { [key: string]: string } = {
  leadSource: 'lead-sources',
  practiceArea: 'practice-areas',
  leadStatus: 'lead-statuses',
  callStatus: 'call-statuses',
  callType: 'call-types',
  callOutcome: 'call-outcomes',
  dealStage: 'deal-stages',
  eventOutcome: 'event-outcomes',
  eventType: 'event-types'
}
