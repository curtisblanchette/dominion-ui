import { DropdownItem } from '../forms';
import { ModuleType } from '../../../../modules/flow/_core';

const modules = new Map([
  [ModuleType.CONTACT, [
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'}
  ]],
  [ModuleType.LEAD, [
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'phone', label: 'Phone'}
  ]],
  [ModuleType.DEAL, [
    {id: 'name', label: 'Name'}
  ]],
  [ModuleType.CALL, [
    {id: 'name', label: 'Name'}
  ]],
  [ModuleType.CAMPAIGN, [
    {id: 'name', label: 'Name'}
  ]],

]);

export const getSearchableColumns = (module: ModuleType): DropdownItem[] => modules.get(module)!;