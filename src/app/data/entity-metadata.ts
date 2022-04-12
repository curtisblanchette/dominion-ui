import { EntityMetadataMap } from '@ngrx/data';
import { Lead } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {
    filterFn: (entities: Lead[], pattern: { q: string }) => {
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
