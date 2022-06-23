import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  address: {},
  contact: {},
  lead: {
    filterFn: (entities: any[], pattern: { q?: string, id?: string } ) => {
      if(pattern.q) {
        return entities.filter((entity: any) => {
          const fields = [
            entity.firstName.toLowerCase(),
            entity.lastName.toLowerCase(),
            entity.phone.toLowerCase(),
            entity.email.toLowerCase()
          ];
          return fields.find(field => field.includes(pattern.q));
        })
      }

      // set the filter so we pull only one from store
      if(pattern.id) {
        return [entities.find((entity: any) => entity.id === pattern.id)];
      }

      return entities;
    },
  },
  call: {},
  deal: {},
  event: {},
  campaign: {},
  leadSource: {},
  office: {},
  note: {},

  role: { noChangeTracking: true },
  practiceArea: { noChangeTracking: true },
  leadStatus: { noChangeTracking: true },
  callOutcome: { noChangeTracking: true },
  callObjection: { noChangeTracking: true },
  callStatus: { noChangeTracking: true },
  callType: { noChangeTracking: true },
  dealStage: { noChangeTracking: true },
  eventOutcome: { noChangeTracking: true },
  eventObjection: { noChangeTracking: true },
  eventType:  { noChangeTracking: true },
  lostReason: { noChangeTracking: true }
};

export const pluralNames = {
  address: 'addresses',
  contact: 'contacts',
  lead: 'leads',
  deal: 'deals',
  call: 'calls',
  event: 'events',
  campaign: 'campaigns',
  leadSource: 'leadSources',
  note: 'notes',
  office: 'offices',

  role: 'roles',
  practiceArea: 'practiceAreas',
  leadStatus: 'leadStatuses',
  callOutcome: 'callOutcomes',
  callObjection: 'callObjections',
  callType: 'callTypes',
  callStatus: 'callStatuses',
  dealStage: 'dealStages',
  eventOutcome: 'eventOutcomes',
  eventObjections: 'eventObjections',
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
  callObjection: 'call-objections',
  dealStage: 'deal-stages',
  eventOutcome: 'event-outcomes',
  eventObjection: 'event-objections',
  eventType: 'event-types',
  lostReason: 'lost-reasons',
  office: 'offices'
}
