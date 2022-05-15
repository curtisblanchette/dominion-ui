import { EntityMetadataMap, QueryParams } from '@ngrx/data';
import { Call, Campaign, Contact, Deal, Event, Lead, LeadSource } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {
    filterFn: (entities: Lead[], pattern: QueryParams | string ) => {
      let start:number = 0;
      let end:number = 0;
      if( typeof pattern !== 'string'){
        const limit:number = Number( pattern['limit'] );
        const page:number = Number( pattern['page'] );
        start = limit * (page - 1);
        end = start + limit;
      }
      if( end > 0 ){
        return entities.slice(start, end);
      } else {
        return entities;
      }
    },
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
