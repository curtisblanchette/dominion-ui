import { EntityMetadataMap, QueryParams } from '@ngrx/data';
import { Call, Campaign, Contact, Deal, Event, Lead, LeadSource } from '@4iiz/corev2';

const entityMetadata: EntityMetadataMap = {
  contact: {
    additionalCollectionState: {
      // attributes: Contact.rawAttributes
    }
  },
  lead: {
    filterFn: (entities: Lead[], pattern: QueryParams | string ) => {
      let start:number = 0;
      let end:number = 0;
      if( typeof pattern !== 'string'){
        const limit:number = Number( pattern['limit'] );
        const page:number = Number( pattern['page'] );
        start = limit * (page - 1);
        end = start + limit;
      }
      if( end > 0 ){
        return entities.slice(start, end);
      } else {
        return entities;
      }
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
