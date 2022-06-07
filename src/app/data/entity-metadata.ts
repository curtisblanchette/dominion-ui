import { EntityMetadataMap } from '@ngrx/data';

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

  role: { noChangeTracking: true },
  practiceArea: { noChangeTracking: true },
  leadStatus: { noChangeTracking: true },
  callOutcome: { noChangeTracking: true },
  callStatus: { noChangeTracking: true },
  callType: { noChangeTracking: true },
  dealStage: { noChangeTracking: true },
  eventOutcome: { noChangeTracking: true },
  eventType:  { noChangeTracking: true },
  lostReason: { noChangeTracking: true }
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
  eventType: 'eventTypes',
  lostReason: 'lostReasons',
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
  eventType: 'event-types',
  lostReason: 'lost-reasons'
}
