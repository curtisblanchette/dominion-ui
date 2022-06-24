import { ModuleTypes } from '../../../../data/entity-metadata';

const columns = new Map([
  [ModuleTypes.CONTACT, [
    {id: 'fullName', label: 'Name'},
    {id: 'phone', label: 'Phone'},
    {id: 'email', label: 'Email'}
  ]],
  [ModuleTypes.LEAD, [
    {id: 'fullName', label: 'Name'},
    {id: 'phone', label: 'Phone'},
    {id: 'email', label: 'Email'}
  ]],
  [ModuleTypes.DEAL, [
    {id: 'name', label: 'Name'},
    {id: 'stage', label: 'Stage'},
    {id: 'createdAt', label: 'Created'},
  ]],
  [ModuleTypes.EVENT, [
    {id: 'title', label: 'Title'},
    {id: 'startTime', label: 'Start Time'},
    {id: 'endTime', label: 'End Time'}
  ]],
  [ModuleTypes.CALL, [
    {id: 'dialledNumber', label: 'Dialled'},
    {id: 'status', label: 'Status'},
    {id: 'outcome', label: 'Outcome'},
    {id: 'direction', label: 'Direction'}
  ]],
  [ModuleTypes.CAMPAIGN, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'},
    {id: 'trackingNumber', label: 'Tracking No.'},
    {id: 'type', label: 'Type'},
  ]],
  [ModuleTypes.LEAD_SOURCE, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'}
  ]],

]);

export const getColumns = (module: ModuleTypes) => columns.get(module)!;
