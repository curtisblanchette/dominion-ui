import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Contact: {},
  Lead: {},
  Deal: {},
  Event: {}
}

export const pluralNames = {
  Contact: 'contacts',
  Lead: 'leads',
  Deal: 'deals',
  Event: 'events'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}
