import { EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  contacts: {},
  leads: {},
  deals: {},
  events: {}
}

export const pluralNames = {
  contacts: 'contacts',
  leads: 'leads',
  deals: 'deals',
  events: 'events'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}
