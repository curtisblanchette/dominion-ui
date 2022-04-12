import { EntityMetadataMap } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {
    filterFn: (entities: Lead[], pattern: { q: string }) => {
      return entities.filter((entity: any) => {
        return (entity.firstName + ' ' + entity.lastName).includes(pattern.q)
          || (entity.phone).includes(pattern.q)
          || (entity.email).includes(pattern.q)
      })
    }
  },
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
