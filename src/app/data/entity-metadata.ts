import { EntityMetadataMap } from '@ngrx/data';
import { Call, Campaign, Contact, Deal, Event, Lead, LeadSource } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {
    additionalCollectionState: {
      // attributes: Contact.rawAttributes
    }
  },
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
    },
    additionalCollectionState: {
      // attributes: Lead.getAttributes()
    }
  },
  call: {
    additionalCollectionState: {
      // attributes: Call.getAttributes()
    }
  },
  deal: {
    additionalCollectionState: {
      // attributes: Deal.getAttributes()
    }
  },
  event: {
    additionalCollectionState: {
      // attributes: Event.getAttributes()
    }
  },
  campaign: {
    additionalCollectionState: {
      // attributes: Campaign.getAttributes()
    }
  },
  leadSource: {
    additionalCollectionState: {
      // attributes: LeadSource.getAttributes()
    }
  },
}

export const pluralNames = {
  contact: 'contacts',
  lead: 'leads',
  deal: 'deals',
  call: 'calls',
  event: 'events',
  campaign: 'campaigns',
  leadSource: 'leadSources'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}

export const uriOverrides: { [key: string]: string } = {
  leadSource: 'lead-sources',
}
