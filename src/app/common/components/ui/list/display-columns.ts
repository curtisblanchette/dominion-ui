import { ModuleTypes } from '../../../../data/entity-metadata';

const columns = new Map([
  [ModuleTypes.CONTACT, [
    {id: 'fullName', label: 'Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.LEAD, [
    {id: 'fullName', label: 'Name'},
    {id: 'email', label: 'Email'},
    {id: 'phone', label: 'Phone'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.DEAL, [
    {id: 'name', label: 'Name'},
    {id: 'stage', label: 'Stage'},
    {id: 'createdAt', label: 'Created'},
  ]],
  [ModuleTypes.EVENT, [
    {id: 'title', label: 'Title'},
    {id: 'startTime', label: 'Start Time'},
    {id: 'endTime', label: 'End Time'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.CALL, [
    {id: 'dialledNumber', label: 'Dialled'},
    {id: 'status', label: 'Status'},
    {id: 'outcome', label: 'Outcome'},
    {id: 'direction', label: 'Direction'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.CAMPAIGN, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'},
    {id: 'trackingNumber', label: 'Tracking No.'},
    {id: 'type', label: 'Type'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.LEAD_SOURCE, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'},
    {id: 'createdAt', label: 'Created'}
  ]],
  [ModuleTypes.OFFICE, [
    {id: 'name', label: 'Name'},
    {id: 'addresses', label: 'Address' }
  ]],
]);

export const getColumns = (module: ModuleTypes) => columns.get(module)!;
