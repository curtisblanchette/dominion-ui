import { EntityMetadataMap, PropsFilterFnFactory } from '@ngrx/data';

export const entityMetadata: EntityMetadataMap = {
  contact: {},
  lead: {
    filterFn: nameFilter,
    sortComparer: sortByName,

    // Override default optimism/pessimism to the opposite of the defaults seen in Hero.
    // Pessimistic delete; optimistic add and update. See VillainsService
    entityDispatcherOptions: {
      optimisticDelete: false,
      optimisticAdd: true,
      optimisticUpdate: true
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

// FILTERS AND SORTERS

// Can't embed these functions directly in the entityMetadata literal because
// AOT requires us to encapsulate the logic in wrapper functions

/** Filter for entities whose name matches the case-insensitive pattern */
export function nameFilter<T extends { name: string }>(entities: T[], pattern: string) {
  return PropsFilterFnFactory(['name'])(entities, pattern);
}

/** Sort Comparer to sort the entity collection by its name property */
export function sortByName(a: { name: string }, b: { name: string }): number {
  return a.name.localeCompare(b.name);
}

/** Filter for entities whose name or saying matches the case-insensitive pattern */
// export function nameAndSayingFilter<T extends { name: string; saying: string }>(
//   entities: T[],
//   pattern: string
// ) {
//   return PropsFilterFnFactory(['name', 'saying'])(entities, pattern);
// }
