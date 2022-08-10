import { FlowStep, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink, FlowAppointmentComponent, FlowObjectionComponent } from './index';
import { Fields as LeadFields } from '../../common/models/lead.model';
import { Fields as DealFields } from '../../common/models/deal.model';
import { Fields as ContactFields } from '../../common/models/contact.model';
import { Fields as EventFields } from '../../common/models/event.model';
import { ModuleTypes } from '../../data/entity-metadata';

export class FlowFactory {

  public static objection(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Objection',
      nodeIcon: 'address-book',
      component: FlowObjectionComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Objection',
          body: '',
          template: 'call-type'
        }
      }
    });
  }

  public static callTypeDecision(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Call Type',
      nodeIcon: 'phone-volume',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Call Type',
          body: 'Select a call type.',
          template: 'call-type'
        }
      }
    });
  }

  public static outboundType(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Outbound Type',
      nodeIcon: 'address-book',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Outbound Type',
          body: 'Lookup an Contact or Opportunity from one of the following lists',
          template: 'outbound-type'
        }
      }
    });
  }

  public static searchNListLeads(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Lead Search',
      nodeIcon: 'address-book',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Lead Search',
          dictation: 'Thank you for calling the Law Offices of {company}, this is {username}, how may I assist you today?'
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: false,
          perPage: 25,
          columns: [],
          query: {
            limit: 3
          },
          controls: {
            perPage: false,
            pagination: false,
            createNew:true,
          }
        }
      }
    })
  }


  public static searchNListContacts(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Search Contacts',
      nodeIcon: 'address-book',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.CONTACT,
        data: {
          title: 'Search Contacts',
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: false,
          perPage: 25,
          columns: [],
          query: {},
          controls: {
            perPage: false,
            pagination: false,
            createNew: false
          }
        }
      }
    })
  }

  public static createLead(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'user-plus',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
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
            LeadFields.EMAIL
          ],
          optimisticSave: false
        }
      }
    });
  };

  public static editLead(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'user-pen',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Review Lead Info'
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(LeadFields),
          optimisticSave: false
        }
      }
    });
  };

  public static createContact(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Contact',
      nodeIcon: 'user-pen',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.CONTACT,
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
            ContactFields.PHONE,
            ContactFields.EMAIL
          ],
          optimisticSave: false
        }
      }
    });
  }

  public static createDeal(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'landmark',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Create Opportunity',
        },
        options: {
          controls: false,
          state: 'create',
          fields: [
            DealFields.NAME
          ],
          optimisticSave: false
        }
      }
    });
  };


  // public static createDeal1(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
  //   return new FlowStep({
  //     nodeText: 'Create Opportunity',
  //     nodeIcon: 'landmark',
  //     component: FlowDataComponent,
  //     beforeRoutingTriggers,
  //     afterRoutingTriggers,
  //     state: {
  //       module: ModuleTypes.DEAL,
  //       data: {
  //         title: 'Create Opportunity'
  //       },
  //       options: {
  //         controls: false,
  //         state: 'create',
  //         fields: [
  //           DealFields.NAME
  //         ],
  //       }
  //     }
  //   });
  // };

  public static editDeal(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Review Opportunity',
      nodeIcon: 'marker',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Review Opportunity',
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(DealFields),
          optimisticSave: false
        }
      }
    });
  };

  public static setLeadSource(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'crosshairs',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Select a Campaign'
        },
        options: {
          controls: false,
          state: 'edit',
          fields: [
            LeadFields.CAMPAIGN_ID,
            LeadFields.LEAD_SOURCE_ID
          ],
          optimisticSave: false
        }
      }
    });
  };

  public static opportunityList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Select an Opportunity',
      nodeIcon: 'table-list',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Select an Opportunity',
        },
        options: {
          searchable: false,
          editable: false,
          loadInitial: true,
          perPage: 25,
          columns: [],
          query: {},
          controls: {
            perPage: false,
            pagination: false,
            createNew: true
          }
        }
      }
    });
  };

  public static noOutcomeList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Pending Outcome List',
      nodeIcon: 'table-list',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.EVENT,
        data: {
          title: 'Pending Outcome List',
        },
        options: {
          searchable: false,
          editable: false,
          loadInitial: true,
          perPage: 25,
          columns: [],
          query: {
            stageId: '2,4,5',
            outcome: null,
          },
          controls: {
            perPage: false,
            pagination: false,
            createNew:true,
          },
        }
      }
    });
  };

  public static relationshipBuilding(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Relationship Building',
      nodeIcon: 'handshake',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Relationship Building',
          // body: '',
          template: 'relationship-building'
        }
      }
    })
  }

  public static powerQuestion(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Power Question',
      nodeIcon: 'clipboard-question',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Power Question',
          // body: '',
          template: 'power-question'
        }
      }
    })
  }

  public static searchNListWebLeads(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    const data = {
      nodeText: 'Search Web Leads',
      nodeIcon: 'table-list',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Search and List Web Leads',
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: false,
          perPage: 3,
          columns: [],
          query: {},
          controls: {
            createNew: true,
            perPage: false,
            pagination: false
          }
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static appointmentList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined):FlowStep {
    const data = {
      nodeText: 'Select an Appointment',
      nodeIcon: 'table-list',
      component: FlowListComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.EVENT,
        data: {
          title: 'Select an Appointment',
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: true,
          perPage: 25,
          columns: [],
          query: {},
          controls: {
            perPage: false,
            pagination: false,
            createNew: true,
          }
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static setAppointment(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Set Appointment',
      nodeIcon: 'calendar-plus',
      component: FlowAppointmentComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.EVENT,
        data: {
          title: 'Set Appointment',
        },
        options: {
          state: 'set',
          fields: [
            EventFields.TITLE,
            EventFields.DESCRIPTION,
            EventFields.TYPE_ID,
            EventFields.START_TIME,
            EventFields.END_TIME,
          ]
        }
      }
    });
  }

  public static verifyInfo(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Verify',
      nodeIcon: 'calendar-check',
      component: FlowDataComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.CONTACT,
        data: {
          title: 'Verify Information',
        },
        options: {
          optimisticSave: false
        }
      }
    });
  };

  public static reasonForCall(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Reason For Call',
      nodeIcon: 'address-book',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Reason for Call',
          template: 'reason-for-call'
        }
      }
    });
  }


  public static recap(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Recap',
      nodeIcon: 'address-book',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Recap Process / Verify Contact ',
          template: 'recap'
        }
      }
    });
  }

  public static end(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'End',
      nodeIcon: 'flag-checkered',
      component: FlowTextComponent.name,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'End',
          template: 'end',
          lastStep : true
        }
      },
      valid: true
    });
  }


  public static step(data: Omit<FlowStep, '_serialize' | '_deserialize' | 'apply' | 'save' | 'release' | 'elapsed'>) {
    return new FlowStep(data)
  }

  public static condition(name: string = '', evaluation: any = undefined, forwardParams: any, to: string | undefined): FlowCondition {
    const data = {name, evaluation, forwardParams, to};
    return new FlowCondition(data);
  }

  public static link(from: string = '', to: string = '') {
    const data = {from, to};
    return new FlowLink(data);
  }

  public static router(nodeText: string, nodeIcon: string = 'fa-split', conditions: FlowCondition[]): FlowRouter {
    const data = {nodeText, nodeIcon, conditions};
    return new FlowRouter(data);
  }

}
