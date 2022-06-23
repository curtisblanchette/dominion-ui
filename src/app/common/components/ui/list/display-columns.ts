import { ModuleType } from '../../../../modules/flow';

const columns = new Map([
  [ModuleType.CONTACT, [
    {id: 'fullName', label: 'Name'},
    {id: 'phone', label: 'Phone'},
    {id: 'email', label: 'Email'}
  ]],
  [ModuleType.LEAD, [
    {id: 'fullName', label: 'Name'},
    {id: 'phone', label: 'Phone'},
    {id: 'email', label: 'Email'}
  ]],
  [ModuleType.DEAL, [
    {id: 'name', label: 'Name'},
    {id: 'stage', label: 'Stage'}
  ]],
  [ModuleType.EVENT, [
    {id: 'title', label: 'Title'},
    {id: 'startTime', label: 'Start Time'},
    {id: 'endTime', label: 'End Time'}
  ]],
  [ModuleType.CALL, [
    {id: 'direction', label: 'Direction'},
    {id: 'status', label: 'Status'},
    {id: 'outcome', label: 'Outcome'},
  ]],
  [ModuleType.CAMPAIGN, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'},
    {id: 'trackingNumber', label: 'Tracking No.'},
    {id: 'type', label: 'Type'},
  ]],
  [ModuleType.LEAD_SOURCE, [
    {id: 'name', label: 'Name'},
    {id: 'status', label: 'Status'}
  ]],

]);

export const getColumns = (module: ModuleType) => columns.get(module)!;
