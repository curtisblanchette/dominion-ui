import { Injectable } from '@angular/core';
import {
  DefaultHttpUrlGenerator,
  HttpResourceUrls,
  normalizeRoot,
  Pluralizer
} from '@ngrx/data';
import { uriOverrides } from './entity-metadata';

@Injectable()
export class PluralHttpUrlGenerator extends DefaultHttpUrlGenerator {
  constructor(private pluralizerService: Pluralizer) {
    super(pluralizerService);
  }

  protected override getResourceUrls(
    entityName: string,
    root: string
  ): HttpResourceUrls {
    let resourceUrls = this.knownHttpResourceUrls[entityName];
    if (!resourceUrls) {
      const nRoot = normalizeRoot(root);

      if(uriOverrides.hasOwnProperty(entityName)) {
        entityName = uriOverrides[entityName];
      } else {
        entityName = this.pluralizerService.pluralize(entityName)
      }
      const url = `${nRoot}/${entityName}/`.toLowerCase();

      resourceUrls = {
        entityResourceUrl: url,
        collectionResourceUrl: url
      };
      this.registerHttpResourceUrls({ [entityName]: resourceUrls });
    }
    return resourceUrls;
  }
}
