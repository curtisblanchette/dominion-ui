import { EntityMetadataMap } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {},
  deal: {},
  event: {}
}

export const pluralNames = {
  contact: 'contacts',
  lead: 'leads',
  deal: 'deals',
  event: 'events'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}
