import { EntityMetadataMap } from '@ngrx/data';

export enum ModuleTypes {
  ADDRESS = 'address',
  LEAD = 'lead',
  CONTACT = 'contact',
  DEAL = 'deal',
  CALL = 'call',
  EVENT = 'event',
  CAMPAIGN = 'campaign',
  LEAD_SOURCE = 'leadSource',
  ROLE = 'role',
  PRACTICE_AREA = 'practiceArea',
  NOTE = 'note',
  OFFICE = 'office'
}

const entityMetadata: EntityMetadataMap = {
  [ModuleTypes.ADDRESS]: {},
  [ModuleTypes.CONTACT]: {},
  [ModuleTypes.LEAD]: {
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
  [ModuleTypes.CALL]: {},
  [ModuleTypes.DEAL]: {},
  [ModuleTypes.EVENT]: {},
  [ModuleTypes.CAMPAIGN]: {},
  [ModuleTypes.LEAD_SOURCE]: {},
  [ModuleTypes.OFFICE]: {},
  [ModuleTypes.NOTE]: {},

  role: { noChangeTracking: true },
  [ModuleTypes.PRACTICE_AREA]: { noChangeTracking: true },
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
  [ModuleTypes.ADDRESS]: 'addresses',
  [ModuleTypes.CONTACT]: 'contacts',
  [ModuleTypes.LEAD]: 'leads',
  [ModuleTypes.DEAL]: 'deals',
  [ModuleTypes.CALL]: 'calls',
  [ModuleTypes.EVENT]: 'events',
  [ModuleTypes.CAMPAIGN]: 'campaigns',
  [ModuleTypes.LEAD_SOURCE]: 'leadSources',
  [ModuleTypes.NOTE]: 'notes',
  [ModuleTypes.OFFICE]: 'offices',

  role: 'roles',
  [ModuleTypes.PRACTICE_AREA]: 'practiceAreas',
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
  [ModuleTypes.ADDRESS]: 'addresses',
  [ModuleTypes.OFFICE]: 'offices',
  [ModuleTypes.CAMPAIGN]: 'campaigns',
  [ModuleTypes.CONTACT]: 'contacts',
  [ModuleTypes.LEAD]: 'leads',
  [ModuleTypes.DEAL]: 'deals',
  [ModuleTypes.LEAD_SOURCE]: 'lead-sources',
  [ModuleTypes.PRACTICE_AREA]: 'practice-areas',
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
}
