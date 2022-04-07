import { ContactCollection } from './contact.collection';
import { DealCollection } from './deal.collection';
import { EventCollection } from './event.collection';
import { LeadCollection } from './lead.collection';
import { ModuleType } from '../../modules/flow/_core/classes/flow.moduleTypes';

export const ModuleCollectionMap: {[key: string]: any} = {
  [ModuleType.CONTACT]: ContactCollection,
  [ModuleType.DEAL]: DealCollection,
  [ModuleType.EVENT]: EventCollection,
  [ModuleType.LEAD]: LeadCollection
};
