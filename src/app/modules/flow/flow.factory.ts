import { FlowStep, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink, FlowAppointmentComponent, FlowObjectionComponent, IEvaluation } from './index';
import { Fields as LeadFields } from '../../common/models/lead.model';
import { Fields as DealFields } from '../../common/models/deal.model';
import { Fields as ContactFields } from '../../common/models/contact.model';
import { Fields as EventFields } from '../../common/models/event.model';
import { ModuleTypes } from '../../data/entity-metadata';

export class FlowFactory {

  public static objection(): FlowStep {
    return new FlowStep({
      nodeText: 'Objection',
      nodeIcon: 'address-book',
      component: FlowObjectionComponent,
      state: {
        data: {
          title: 'Objection',
          body: '',
          template: 'call-type'
        }
      }
    });
  }

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
        module: ModuleTypes.LEAD,
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
        module: ModuleTypes.CONTACT,
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

  public static createLead(): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Create New Lead'
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

  public static editLead(resolveId: ModuleTypes | null): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Review Lead Info',
          resolveId
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(LeadFields)
        }
      }
    });
  };

  public static createContact(resolveId: ModuleTypes | null = null, resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Contact',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.CONTACT,
        data: {
          title: 'Create New Contact',
          resolveId,
          resolveData
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            ContactFields.LEAD_ID,
            ContactFields.FIRST_NAME,
            ContactFields.LAST_NAME,
            ContactFields.PHONE,
            ContactFields.EMAIL
          ]
        }
      }
    });
  }

  public static createDeal(resolveId: ModuleTypes | null, resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Create Opportunity',
          resolveId,
          resolveData
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

  
  public static createDeal1(): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Create Opportunity'
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            DealFields.LEAD_ID,
            DealFields.NAME
          ],
        }
      }
    });
  };
  
  public static editDeal(resolveId: ModuleTypes | null, resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Review Deal Info',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Review Deal Info',
          resolveId,
          resolveData
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(DealFields)
        }
      }
    });
  };

  public static setLeadSource(resolveId: ModuleTypes | null, resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'address-book',
      component: FlowDataComponent,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Select a Campaign',
          resolveId,
          resolveData
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

  public static opportunityList(resolveQuery: {[key: string]: any} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Opportunity List',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Opportunity List',
        },
        options: {
          searchable: false,
          editable: false,
          perPage: 25,
          columns: [],
          query: {
          },
          resolveQuery
        }
      }
    });
  };

  public static noOutcomeList(resolveQuery: {[key: string]: any} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'No Outcome List',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Opportunity List',
        },
        options: {
          searchable: false,
          editable: false,
          perPage: 25,
          columns: [],
          query: {
            stageId: '2,4,5'
          },
          resolveQuery
        }
      }
    });
  };

  public static relationshipBuilding(resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Relationship Building',
      nodeIcon: 'fa-gear',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Relationship Building',
          // body: '',
          template: 'relationship-building',
          resolveData
        }
      }
    })
  }

  public static powerQuestion(resolveData: {[key: string]: ModuleTypes} = {}): FlowStep {
    return new FlowStep({
      nodeText: 'Power Question',
      nodeIcon: 'fa-address-book',
      component: FlowTextComponent,
      state: {
        data: {
          title: 'Power Question',
          // body: '',
          template: 'power-question',
          resolveData
        }
      }
    })
  }

  public static searchNListWebLeads(resolveQuery: {[key: string]: ModuleTypes} = {}): FlowStep {
    const data = {
      nodeText: 'Search Web Leads',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Search and List Web Leads',
        },
        options: {
          searchable: true,
          editable: false,
          perPage: 25,
          columns: [],
          resolveQuery
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
        module: ModuleTypes.EVENT,
        data: {
          title: 'Set Appointment'
        },
        options: {
          state: 'create',
          fields: [
            EventFields.CONTACT_ID,
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
        module: ModuleTypes.CONTACT,
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

  public static end(): FlowStep {
    return new FlowStep({
      nodeText: 'End',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      state: {
        data: {
          template: 'end'
        }
      }
    });
  }


  public static step(data: Omit<FlowStep, '_serialize' | '_deserialize' | 'apply' | 'save' | 'release' | 'elapsed'>) {
    return new FlowStep(data)
  }

  public static condition(evaluation: IEvaluation, forwardParams: any, to: FlowStep | FlowRouter): FlowCondition {
    const data = {evaluation, forwardParams, to};
    return new FlowCondition(data);
  }

  public static link(from: FlowStep, to: FlowStep | FlowRouter) {
    const data = {from, to};
    return new FlowLink(data);
  }

  public static router(nodeText: string, nodeIcon: string, conditions: FlowCondition[]): FlowRouter {
    const data = {nodeText, nodeIcon, conditions};
    return new FlowRouter(data);
  }

}
