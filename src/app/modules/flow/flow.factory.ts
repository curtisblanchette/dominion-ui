import { FlowStep, ModuleType, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink } from './_core';
import { LeadModel } from '../../common/models/lead.model';

export class FlowFactory {

  public static callTypeDecision(): FlowStep {
    return new FlowStep({
      nodeText: 'Call Type',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      data: {
        title: 'Call Type',
        body: 'Select one of the call types below.',
        template: 'call-type'
      }
    });
  }

  public static webLeadsType(): FlowStep {
    return new FlowStep({
      nodeText: 'Web Leads type',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      data: {
        title: 'How you wanna proceed',
        body: 'select any one options below',
        template: 'web-lead'
      }
    });
  }

  public static searchNListLeads(): FlowStep {
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
  }

  public static createLead(): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      data: {
        title: 'Create New Lead',
        module: ModuleType.LEAD,
        options: {
          controls: false,
          state: 'create',
          fields: {
            firstName: LeadModel['firstName'],
            lastName: LeadModel['lastName'],
            phone: LeadModel['phone'],
            email: LeadModel['email'],
            state: LeadModel['state']
          }
        }
      }
    });
  };

  public static editLead(): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      data: {
        title: 'Review Lead Info',
        module: ModuleType.LEAD,
        options: {
          controls: false,
          state: 'edit',
          fields: LeadModel // all fields
        }
      }
    });
  };

  public static setLeadSource(resolve: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      data: {
        title: 'Select a Lead Source',
        module: ModuleType.LEAD,
        resolve,
        options: {
          controls: false,
          state: 'edit',
          fields: {
            campaignId: LeadModel['campaignId']
          }
        }
      }
    });
  };

  public static selectExistingOpp(query: Function = () => {}): FlowStep {
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
          query
        }
      }
    });
  };

  public static relationshipBuilding(resolve: Function = () => {}) {
    return new FlowStep({
      nodeText: 'Relationship Building',
      nodeIcon: 'fa-gear',
      component: FlowTextComponent,
      data: {
        title: 'Relationship Building',
        // body: '',
        template: 'relationship-building'
      }
    })
  }

  public static powerQuestion(resolve: Function = () => {}) {
    return new FlowStep({
      nodeText: 'Power Question',
      nodeIcon: 'fa-address-book',
      component: FlowTextComponent,
      data: {
        title: 'Power Question',
        // body: '',
        template: 'power-question'
      }
    })
  }

  public static searchNListWebLeads(): FlowStep {
    const data = {
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
    }
    return FlowFactory.step(data);
  }

  public static step(data: Omit<FlowStep, 'serialize' | 'deserialize' | 'apply' | 'save' | 'release' | 'elapsed'>) {
    return new FlowStep(data)
  }

  public static condition(evaluate: Function, to: FlowStep | FlowRouter): FlowCondition {
    return new FlowCondition(evaluate, to);
  }

  public static link(from: FlowStep, to: FlowStep | FlowRouter) {
    return new FlowLink(from, to);
  }

  public static router(nodeText: string, nodeIcon: string, conditions: FlowCondition[]): FlowRouter {
    return new FlowRouter(nodeText, nodeIcon, conditions);
  }

}
