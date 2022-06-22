import { FlowStep, ModuleType, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink, FlowAppointmentComponent } from './index';
import { Fields as LeadFields } from '../../common/models/lead.model';
import { Fields as DealFields } from '../../common/models/deal.model';
import { Fields as ContactFields } from '../../common/models/contact.model';
import { Fields as EventFields } from '../../common/models/event.model';

export class FlowFactory {

  public static callTypeDecision(): FlowStep {
    return new FlowStep({
      nodeText: 'Call Type',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Call Type',
          body: 'Select one of the call types below.',
          template: 'call-type'
        }
      }
    });
  }

  public static webLeadsType(): FlowStep {
    return new FlowStep({
      nodeText: 'Search and List',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Search and List',
          body: 'Lookup an Contact or Opportunity from one of the following lists',
          template: 'web-lead'
        }
      }
    });
  }

  public static searchNListLeads(): FlowStep {
    return new FlowStep({
      nodeText: 'Search Leads',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleType.LEAD,
        data: {
          title: 'Lead List',
        },
        options: {
          searchable: true,
          editable: false,
          perPage: 25,
          columns: []
        }
      }
    })
  }


  public static searchNListContacts(): FlowStep {
    return new FlowStep({
      nodeText: 'Search Contacts',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleType.CONTACT,
        data: {
          title: 'Search Contacts',
        },
        options: {
          searchable: true,
          editable: false,
          perPage: 25,
          columns: []
        }
      }
    })
  }

  public static createLead(resolveId: Function = () => {}, resolveAdditionalData: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.LEAD,
        data: {
          title: 'Create New Lead',
          resolveId,
          resolveAdditionalData
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            LeadFields.FIRST_NAME,
            LeadFields.LAST_NAME,
            LeadFields.PHONE,
            LeadFields.EMAIL,
            LeadFields.STATE
          ]
        }
      }
    });
  };

  public static editLead(resolve: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.LEAD,
        data: {
          title: 'Review Lead Info',
          resolve
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(LeadFields)
        }
      }
    });
  };

  public static createContact(): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Contact',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.CONTACT,
        data: {
          title: 'Create New Contact'
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            ContactFields.LEAD_ID,
            ContactFields.FIRST_NAME,
            ContactFields.LAST_NAME,
            ContactFields.LEAD_ID,
            ContactFields.PHONE,
            ContactFields.EMAIL
          ]
        }
      }
    });
  }

  public static createDeal(resolveId: Function = () => {}, resolveAdditionalData: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.DEAL,
        data: {
          title: 'Create Opportunity',
          resolveId,
          resolveAdditionalData
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            DealFields.NAME
          ],
        }
      }
    });
  };

  public static editDeal(resolveId: Function = () => {}, resolveAdditionalData: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Review Deal Info',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.DEAL,
        data: {
          title: 'Review Deal Info',
          resolveId,
          resolveAdditionalData
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(DealFields)
        }
      }
    });
  };

  public static setLeadSource(resolveId: Function = () => {}, resolveAdditionalData: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.LEAD,
        data: {
          title: 'Select a Campaign',
          resolveId,
          resolveAdditionalData
        },
        options: {
          controls: false,
          state: 'edit',
          fields: [
            LeadFields.CAMPAIGN_ID
          ]
        }
      }
    });
  };

  public static selectExistingOpp(query: Function = () => {}): FlowStep {
    return new FlowStep({
      nodeText: 'Opportunity List',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleType.DEAL,
        data: {
          title: 'Opportunity List',
        },
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
      state: {
        data: {
          title: 'Relationship Building',
          // body: '',
          template: 'relationship-building',
          resolve
        }
      }
    })
  }

  public static powerQuestion(resolve: Function = () => {}) {
    return new FlowStep({
      nodeText: 'Power Question',
      nodeIcon: 'fa-address-book',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Power Question',
          // body: '',
          template: 'power-question',
          resolve
        }
      }
    })
  }

  public static searchNListWebLeads(query: Function = () => {}): FlowStep {
    const data = {
      nodeText: 'Search Web Leads',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleType.LEAD,
        data: {
          title: 'Search and List Web Leads',
        },
        options: {
          searchable: true,
          editable: false,
          perPage: 25,
          columns: [],
          query
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static setAppointment():FlowStep {
    return new FlowStep({
      nodeText: 'Set Appointment',
      nodeIcon: 'address-book',
      component: FlowAppointmentComponent,
      state: {
        module: ModuleType.EVENT,
        data: {
          title: 'Set Appointment'
        },
        options: {
          fields: [
            EventFields.TITLE,
            EventFields.DESCRIPTION,
            EventFields.TYPE_ID,
            EventFields.START_TIME,
            EventFields.END_TIME
          ]
        }
      }
    });
  }

  public static verifyInfo(): FlowStep {
    return new FlowStep({
      nodeText: 'Verify',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleType.CONTACT,
        data: {
          title: 'Verify Information',
        }
      }
    });
  };

  public static recap(): FlowStep {
    return new FlowStep({
      nodeText: 'Recap',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Recap',
          body: 'Recap',
          template: 'recap'
        }
      }
    });
  }

  public static step(data: Omit<FlowStep, '_serialize' | '_deserialize' | 'apply' | 'save' | 'release' | 'elapsed'>) {
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
