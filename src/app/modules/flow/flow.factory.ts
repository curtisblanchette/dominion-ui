import { FlowStep, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink, FlowAppointmentComponent, FlowObjectionComponent, IEvaluation } from './index';
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
      component: FlowObjectionComponent,
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
      component: FlowTextComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Call Type',
          body: 'Select from one of the call types below.',
          template: 'call-type'
        }
      }
    });
  }

  public static webLeadsType(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Search and List',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'Search and List',
          body: 'Lookup an Contact or Opportunity from one of the following lists',
          template: 'web-lead'
        }
      }
    });
  }

  public static searchNListLeads(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Search Leads',
      nodeIcon: 'address-book',
      component: FlowListComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Search Leads',
          dictation: 'Thank you for calling the Law Offices of {company}, this is {username}, how may I assist you today?'
        },
        options: {
          searchable: true,
          editable: false,
          createNew:true,
          perPage: 25,
          columns: [],
          query: {}
        }
      }
    })
  }


  public static searchNListContacts(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Search Contacts',
      nodeIcon: 'address-book',
      component: FlowListComponent,
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
          createNew: false,
          perPage: 25,
          columns: [],
          query: {}
        }
      }
    })
  }

  public static createLead(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'user-plus',
      component: FlowDataComponent,
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
          ]
        }
      }
    });
  };

  public static editLead(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'user-pen',
      component: FlowDataComponent,
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
          fields: Object.values(LeadFields)
        }
      }
    });
  };

  public static createContact(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Contact',
      nodeIcon: 'user-pen',
      component: FlowDataComponent,
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
          ]
        }
      }
    });
  }

  public static createDeal(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'landmark',
      component: FlowDataComponent,
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
          ]
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
      nodeText: 'Review Deal Info',
      nodeIcon: 'marker',
      component: FlowDataComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Review Deal Info',
        },
        options: {
          controls: false,
          state: 'edit',
          fields: Object.values(DealFields)
        }
      }
    });
  };

  public static setLeadSource(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'crosshairs',
      component: FlowDataComponent,
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
            LeadFields.CAMPAIGN_ID
          ]
        }
      }
    });
  };

  public static opportunityList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Opportunity List',
      nodeIcon: 'table-list',
      component: FlowListComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Opportunity List',
        },
        options: {
          searchable: false,
          editable: false,
          createNew:true,
          perPage: 25,
          columns: [],
          query: {
          }
        }
      }
    });
  };

  public static noOutcomeList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'No Outcome List',
      nodeIcon: 'table-list',
      component: FlowListComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.EVENT,
        data: {
          title: 'No Outcome List',
        },
        options: {
          searchable: false,
          editable: false,
          createNew:true,
          perPage: 25,
          columns: [],
          query: {
            stageId: '2,4,5',
            outcome: null,
          }
        }
      }
    });
  };

  public static relationshipBuilding(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Relationship Building',
      nodeIcon: 'handshake',
      component: FlowTextComponent,
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
      component: FlowTextComponent,
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
      component: FlowListComponent,
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
          createNew:true,
          perPage: 25,
          columns: [],
          query: {}
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static appointmentList(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined):FlowStep {
    const data = {
      nodeText: 'Search Appointments',
      nodeIcon: 'table-list',
      component: FlowListComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.EVENT,
        data: {
          title: 'Search Appointments',
        },
        options: {
          searchable: true,
          createNew: true,
          editable: false,
          perPage: 25,
          columns: [],
          query: {}
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static setAppointment(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Set Appointment',
      nodeIcon: 'calendar-plus',
      component: FlowAppointmentComponent,
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
      component: FlowDataComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        module: ModuleTypes.CONTACT,
        data: {
          title: 'Verify Information',
        }
      }
    });
  };

  public static reasonForCall(beforeRoutingTriggers: any = undefined, afterRoutingTriggers: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Reason For Call',
      nodeIcon: 'address-book',
      component: FlowTextComponent,
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
      component: FlowTextComponent,
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
      component: FlowTextComponent,
      beforeRoutingTriggers,
      afterRoutingTriggers,
      state: {
        data: {
          title: 'End',
          template: 'end',
          lastStep : true
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

  public static router(nodeText: string, nodeIcon: string = 'fa-split', conditions: FlowCondition[]): FlowRouter {
    const data = {nodeText, nodeIcon, conditions};
    return new FlowRouter(data);
  }

}
