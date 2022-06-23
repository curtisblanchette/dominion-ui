import { ModuleTypes } from '../../../../modules/flow';

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
    {id: 'stage', label: 'Stage'}
  ]],
  [ModuleTypes.EVENT, [
    {id: 'title', label: 'Title'},
    {id: 'startTime', label: 'Start Time'},
    {id: 'endTime', label: 'End Time'}
  ]],
  [ModuleTypes.CALL, [
    {id: 'direction', label: 'Direction'},
    {id: 'status', label: 'Status'},
    {id: 'outcome', label: 'Outcome'},
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
