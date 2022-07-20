import { DropdownItem } from '../forms';
import { ModuleTypes } from '../../../../data/entity-metadata';

/**
 * NOTE:
 *  The 1st Array item is chosen as the default SORT column
 */
const modules = new Map([
  [ModuleTypes.CONTACT, [
    {id: 'createdAt', label: 'Created'},
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'},
  ]],
  [ModuleTypes.LEAD, [
    {id: 'createdAt', label: 'Created'},
    {id: 'firstName', label: 'First Name'},
    {id: 'lastName', label: 'Last Name'},
    {id: 'phone', label: 'Phone'},
  ]],
  [ModuleTypes.DEAL, [
    {id: 'createdAt', label: 'Created'},
    {id: 'name', label: 'Name'},
  ]],
  [ModuleTypes.CALL, [
    {id: 'createdAt', label: 'Created'},
  ]],
  [ModuleTypes.CAMPAIGN, [
    {id: 'createdAt', label: 'Created'},
    {id: 'name', label: 'Name'},
  ]],
  [ModuleTypes.OFFICE, [
    {id: 'name', label: 'Name'},
  ]],
  [ModuleTypes.ADDRESS, [
    {id: 'line1', label: 'Line1'},
    {id: 'city', label: 'City'},
    {id: 'stateCode', label: 'State'},
    {id: 'countryCode', label: 'Country'},
    {id: 'zipCode', label: 'Zip Code'},
  ]],
  [ModuleTypes.EVENT, [
    {id: 'createdAt', label: 'Created'},
    {id: 'title', label: 'Title'}
  ]],
  [ModuleTypes.LEAD_SOURCE, [
    {id : 'createdAt', label : 'Created'},
    {id : 'name', label : 'Name'},
    {id : 'status', label : 'Status'}
  ]]
]);

export const getSearchableColumns = (module: ModuleTypes): DropdownItem[] => modules.get(module)!;
