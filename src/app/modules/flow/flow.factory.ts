import { FlowStep, ModuleType, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink } from './_core';

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

  public static searchNListContacts(): FlowStep {
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

  public static createEditLead(): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      data: {
        title: 'Create New Lead',
        module: ModuleType.LEAD,
        options: {
          controls: false,
          state: 'create'
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
