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

  OFFICE = 'office',
  WORKSPACE = 'workspace'
}

export enum LookupTypes {
  PRACTICE_AREA = 'practiceArea',
  DEAL_STAGE = 'dealStage',
  LOST_REASON = 'lostReason',
  TIMEZONE = 'timezone',
  STATE = 'state',
  LEAD_STATUS = 'leadStatus',
  CALL_TYPE = 'callType',
  CALL_OUTCOME = 'callOutcome',
  CALL_OBJECTION = 'callObjection',
  CALL_STATUS = 'callStatus',
  EVENT_TYPE = 'eventType',
  EVENT_OUTCOME = 'eventOutcome',
  EVENT_OBJECTION = 'eventObjection',
  ROLE = 'role'
}

const entityMetadata: EntityMetadataMap = {
  [ModuleTypes.WORKSPACE]: {},
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

  [LookupTypes.LEAD_STATUS]: { noChangeTracking: true },
  [LookupTypes.DEAL_STAGE]: { noChangeTracking: true },
  [LookupTypes.LOST_REASON]: { noChangeTracking: true },

  [LookupTypes.PRACTICE_AREA]: { noChangeTracking: true },
  [LookupTypes.ROLE]: { noChangeTracking: true },
  [LookupTypes.CALL_OUTCOME]: { noChangeTracking: true },
  [LookupTypes.CALL_OBJECTION]: { noChangeTracking: true },
  [LookupTypes.CALL_STATUS]: { noChangeTracking: true },
  [LookupTypes.CALL_TYPE]: { noChangeTracking: true },

  [LookupTypes.EVENT_OUTCOME]: { noChangeTracking: true },
  [LookupTypes.EVENT_OBJECTION]: { noChangeTracking: true },
  [LookupTypes.EVENT_TYPE]:  { noChangeTracking: true },

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
  [ModuleTypes.OFFICE]: 'offices',
  [ModuleTypes.WORKSPACE]: 'workspaces',


  [LookupTypes.LEAD_STATUS]: 'leadStatuses',
  [LookupTypes.DEAL_STAGE]: 'dealStages',
  [LookupTypes.LOST_REASON]: 'lostReasons',
  [LookupTypes.PRACTICE_AREA]: 'practiceAreas',
  [LookupTypes.ROLE]: 'roles',
  [LookupTypes.CALL_OUTCOME]: 'callOutcomes',
  [LookupTypes.CALL_OBJECTION]: 'callObjections',
  [LookupTypes.CALL_TYPE]: 'callTypes',
  [LookupTypes.CALL_STATUS]: 'callStatuses',

  [LookupTypes.EVENT_OUTCOME]: 'eventOutcomes',
  [LookupTypes.EVENT_OBJECTION]: 'eventObjections',
  [LookupTypes.EVENT_TYPE]: 'eventTypes',

  [LookupTypes.TIMEZONE]: 'timezones',
  [LookupTypes.STATE]: 'state',

}


export const entityConfig = {
  entityMetadata,
  pluralNames
}

export const uriOverrides: { [key: string]: string } = {
  [ModuleTypes.WORKSPACE]: 'system/workspaces',
  [ModuleTypes.ADDRESS]: 'addresses',
  [ModuleTypes.OFFICE]: 'offices',
  [ModuleTypes.CAMPAIGN]: 'campaigns',
  [ModuleTypes.CONTACT]: 'contacts',
  [ModuleTypes.LEAD]: 'leads',
  [ModuleTypes.DEAL]: 'deals',
  [ModuleTypes.CALL]: 'calls',
  [ModuleTypes.EVENT]: 'events',
  [ModuleTypes.LEAD_SOURCE]: 'lead-sources',
  [LookupTypes.PRACTICE_AREA]: 'practice-areas',
  [LookupTypes.LEAD_STATUS]: 'lead-statuses',
  [LookupTypes.CALL_STATUS]: 'call-statuses',
  [LookupTypes.CALL_TYPE]: 'call-types',
  [LookupTypes.CALL_OUTCOME]: 'call-outcomes',
  [LookupTypes.CALL_OBJECTION]: 'call-objections',
  [LookupTypes.DEAL_STAGE]: 'deal-stages',
  [LookupTypes.EVENT_OUTCOME]: 'event-outcomes',
  [LookupTypes.EVENT_OBJECTION]: 'event-objections',
  [LookupTypes.EVENT_TYPE]: 'event-types',
  [LookupTypes.LOST_REASON]: 'lost-reasons',
}
