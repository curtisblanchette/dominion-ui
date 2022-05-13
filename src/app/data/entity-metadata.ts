import { EntityMetadataMap } from '@ngrx/data';
import { Call, Campaign, Contact, Deal, Event, Lead, LeadSource } from '@4iiz/corev2';

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
    },
  },
  call: {},
  deal: {},
  event: {},
  campaign: {},
  leadSource: {},
  role: {},
  practiceArea: {},
  leadStatus: {}
}

export const pluralNames = {
  contact: 'contacts',
  lead: 'leads',
  deal: 'deals',
  call: 'calls',
  event: 'events',
  campaign: 'campaigns',
  leadSource: 'leadSources',
  role: 'roles',
  practiceArea: 'practiceAreas',
  leadStatus: 'leadStatuses'
}

export const entityConfig = {
  entityMetadata,
  pluralNames
}

export const uriOverrides: { [key: string]: string } = {
  leadSource: 'lead-sources',
  practiceArea: 'practice-areas',
  leadStatus: 'lead-statuses'
}
