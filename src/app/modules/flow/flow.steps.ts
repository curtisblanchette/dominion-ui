import { FlowStep, ModuleType, FlowListComponent, FlowTextComponent, FlowDataComponent } from './_core';

export const callType = () => {
  return new FlowStep({
    nodeText: 'Call Type',
    nodeIcon: 'address-book',
    component: FlowTextComponent,
    data : {
      title : 'Select a call type',
      body : 'select any one call type',
      template : 'call-type'
    }
  });
};

export const webLeadsType = () => {
  return new FlowStep({
    nodeText: 'Web Leads type',
    nodeIcon: 'address-book',
    component: FlowTextComponent,
    data: {
      title : 'How you wanna proceed',
      body : 'select any one options below',
      template : 'web-lead'
    }
  });
};

export const searchNListContacts = () => {
  return new FlowStep({
    nodeText: 'Search Leads',
    nodeIcon: 'address-book',
    component: FlowListComponent,
    data: {
      title: 'Lead List',
      module: ModuleType.LEAD,
      options: {
        searchable: true,
        editable: false,
        perPage: 25,
        columns: []
      }
    }
  })
};

export const createNewLead = () => {
  return new FlowStep({
    nodeText: 'Collect Lead Info',
    nodeIcon: 'address-book',
    component: FlowDataComponent,
    data: {
      title: 'Create a New Lead',
      // firstName: 'Curtis',
      // lastName: 'Blanchette',
      // phone: '+12507183166',
      // email: 'curtis@4iiz.com',
      module: ModuleType.LEAD
    }
  });
};

export const selectExistingOpp = () => {
  return new FlowStep({
    nodeText: 'Opportunities',
    nodeIcon: 'address-book',
    component: FlowListComponent,
    data: {
      title: 'Opportunities',
      module: ModuleType.DEAL,
      options: {
        searchable: false,
        editable: false,
        perPage: 25,
        columns: [],
        parentId: null
      }
    }
  });
};

export const searchNListWebLeads = () => {
  return new FlowStep({
    nodeText: 'Search Web Leads',
    nodeIcon: 'address-book',
    component: FlowListComponent,
    data: {
      title: 'Search and List Web Leads',
      module: ModuleType.LEAD,
      options: {
        searchable: true,
        editable: false,
        perPage: 25,
        columns: []
      }
    }
  });
};
