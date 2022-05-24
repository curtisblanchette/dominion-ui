import { FlowStep } from "./_core";
import { FlowComponentType } from "./_core/step-components";
import { ModuleType } from './_core/classes/flow.moduleTypes';

export const callType = new FlowStep({
    nodeText : 'Call Type',
    nodeIcon : 'address-book',
    component : FlowComponentType.TEXT,
    data : {
      title : 'How you wanna proceed',
      body : 'select any one call type',
      template : 'call-type'
    }
});

export const webLeadsType = new FlowStep({
    nodeText : 'Web Leads type',
    nodeIcon : 'address-book',
    component : FlowComponentType.TEXT,
    data : {
      title : 'How you wanna proceed',
      body : 'select any one options below',
      template : 'web-lead'
    }
});

export const searchNListContacts = new FlowStep({
    nodeText: 'Search Contacts',
    nodeIcon: 'address-book',
    component: FlowComponentType.LIST,
    data: {
      title: 'Search Contacts',
      module: ModuleType.CONTACT,
      options: {
        searchable: true,
        editable: false,
        perPage: 25,
        columns: []
      },
      editPath: {
        route: ['/flow/f', {outlets: {'aux': ['edit']}}],
        extras: {
          state: {
            module: module,
          }
        }
      }
    }
});

export const createNewLead = new FlowStep({
    nodeText: 'Collect Lead Info',
    nodeIcon: 'address-book',
    component: FlowComponentType.DATA,
    data: {
      title: 'Create a New Lead',
      firstName: 'Curtis',
      lastName: 'Blanchette',
      phone: '+12507183166',
      email: 'curtis@4iiz.com',
      module: ModuleType.LEAD
    }
});

export const selectExistingOpp = new FlowStep({
  nodeText: 'Select Existing opp',
  nodeIcon: 'address-book',
  component: FlowComponentType.LIST,
  data: {
    title: 'Search Contacts',
    module: ModuleType.DEAL,
    options: {
      searchable: false,
      editable: false,
      perPage: 25,
      columns: [],
      parentId: null
    },
    editPath: {
      route: ['/flow/f', {outlets: {'aux': ['edit']}}],
      extras: {
        state: {
          module: module,
        }
      }
    }
  }
});

export const searchNListWebLeads = new FlowStep({
    nodeText: 'Search Web Leads',
    nodeIcon: 'address-book',
    component: FlowComponentType.LIST,
    data: {
      title: 'Search and List Web Leads',
      module: ModuleType.LEAD,
      options: {
        searchable: true,
        editable: false,
        perPage: 25,
        columns: []
      },
      editPath: {
        route: ['/flow/f', {outlets: {'aux': ['edit']}}],
        extras: {
          state: {
            module: module,
          }
        }
      }
    }
});