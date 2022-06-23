import { DropdownItem } from '../forms';
import { ModuleTypes } from '../../../../modules/flow';

const modules = new Map([
  [ModuleTypes.CONTACT, [
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'}
  ]],
  [ModuleTypes.LEAD, [
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'phone', label: 'Phone'}
  ]],
  [ModuleTypes.DEAL, [
    {id: 'name', label: 'Name'}
  ]],
  [ModuleTypes.CALL, [
    {id: 'name', label: 'Name'}
  ]],
  [ModuleTypes.CAMPAIGN, [
    {id: 'name', label: 'Name'}
  ]],

]);

export const getSearchableColumns = (module: ModuleTypes): DropdownItem[] => modules.get(module)!;
