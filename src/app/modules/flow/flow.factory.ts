import { FlowStep, FlowListComponent, FlowTextComponent, FlowDataComponent, FlowCondition, FlowRouter, FlowLink, FlowAppointmentComponent, FlowObjectionComponent } from './index';
import { Fields as LeadFields } from '../../common/models/lead.model';
import { Fields as DealFields } from '../../common/models/deal.model';
import { Fields as ContactFields } from '../../common/models/contact.model';
import { Fields as EventFields } from '../../common/models/event.model';
import { ModuleTypes } from '../../data/entity-metadata';
import { environment } from '../../../environments/environment';

export class FlowFactory {

  public static objection(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Objection',
      nodeIcon: 'address-book',
      component: FlowObjectionComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'call-type',
        data: {
          title: 'Objection',
          body: '',
        }
      }
    });
  }

  public static callDirection(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Call Direction',
      nodeIcon: 'phone-volume',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'call-direction',
        data: {
          title: 'Call Direction',
          body: 'Select a call direction.',
        }
      }
    });
  }

  public static outboundType(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Outbound Type',
      nodeIcon: 'address-book',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'outbound-type',
        data: {
          title: 'Outbound Type',
          body: 'Lookup by Contact or Opportunity from one of the following lists',
        }
      }
    });
  }

  public static searchLeads(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Lead Search',
      nodeIcon: 'address-book',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Lead Search',
          dictation: 'Thank you for calling the Law Offices of {company_name}, this is {user_name}, how may I assist you today?'
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: true,
          perPage: 7,
          columns: [],
          query: {
            // limit: 7
          },
          controls: {
            perPage: true,
            pagination: true,
            createNew: true,
          }
        }
      }
    })
  }


  public static searchContacts(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Search Contacts',
      nodeIcon: 'address-book',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.CONTACT,
        data: {
          title: 'Search Contacts',
          body: 'Search for any contact.'
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
            createNew: true
          },
          createModule: ModuleTypes.LEAD
        }
      }
    })
  }

  public static createLead(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Lead',
      nodeIcon: 'user-plus',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static editLead(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Review Lead Info',
      nodeIcon: 'user-pen',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Review Lead Info'
        },
        options: {
          controls: false,
          state: 'edit',
          grid: {
            minColWidth: 240
          },
          fields: Object.values(LeadFields),
          optimisticSave: false
        }
      }
    });
  };

  public static createContact(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create New Contact',
      nodeIcon: 'user-pen',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static createDeal(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Create Opportunity',
      nodeIcon: 'landmark',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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


  // public static createDeal1(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
  //   return new FlowStep({
  //     nodeText: 'Create Opportunity',
  //     nodeIcon: 'landmark',
  //     component: FlowDataComponent,
  //     beforeRoutingTrigger,
  //     afterRoutingTrigger,
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

  public static editDeal(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Review Opportunity',
      nodeIcon: 'marker',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Review Opportunity',
        },
        options: {
          controls: false,
          state: 'edit',
          grid: {
            minColWidth: 240
          },
          fields: Object.values(DealFields),
          optimisticSave: false
        }
      }
    });
  };

  public static setLeadSource(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Select Lead Source',
      nodeIcon: 'crosshairs',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static opportunityList(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Select an Opportunity',
      nodeIcon: 'table-list',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static oppFollowUpList(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Opportunity Follow Up List',
      nodeIcon: 'table-list',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.DEAL,
        data: {
          title: 'Opportunity Follow Up List',
          body: 'No Set, No Show, No Hires'
        },
        options: {
          searchable: false,
          editable: false,
          loadInitial: true,
          perPage: 25,
          columns: [],
          query: {
            stageId: '2,4,5',
            scheduledCallBack: {
              lt: new Date() // keep in mind: this only updates when the call resets
            },
            score: {
              gt: environment.opp_follow_up_min_score
            },
            sort_by: 'score',
            sort: 'DESC'
          },
          controls: {
            perPage: false,
            pagination: false,
            createNew:false,
          },
        }
      }
    });
  };

  public static oppFollowUp(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Opportunity Follow Up',
      nodeIcon: 'clipboard',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.DEAL,
        template: 'opp-follow-up',
        data: {
          title: 'Opportunity Follow Up',
          body: 'Now is the time to review notes previously collected for this opportunity.',
        }
      }
    });
  }

  public static relationshipBuilding(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Relationship Building',
      nodeIcon: 'handshake',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'relationship-building',
        data: {
          title: 'Relationship Building',
          // body: '',
        }
      }
    })
  }

  public static powerQuestion(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Power Question',
      nodeIcon: 'clipboard-question',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'power-question',
        data: {
          title: 'Power Question',
          body: 'Be sure to use a power question. We want to create a sense of urgency so the PC shows up to their consultation ready to hire.',
        }
      }
    })
  }

  public static webLeadsList(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    const data = {
      nodeText: 'Search Web Leads',
      nodeIcon: 'table-list',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        module: ModuleTypes.LEAD,
        data: {
          title: 'Search and List Web Leads',
        },
        options: {
          searchable: true,
          editable: false,
          loadInitial: true,
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

  public static appointmentList(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined):FlowStep {
    const data = {
      nodeText: 'Select an Appointment',
      nodeIcon: 'table-list',
      component: FlowListComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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
          columns: [
            'title',
            'startTime',
            'endTime',
            'createdAt'
          ],
          query: {},
          controls: {
            perPage: false,
            pagination: false,
            createNew: false,
          }
        }
      }
    };
    return FlowFactory.step(data);
  }

  public static setAppointment(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Set Appointment',
      nodeIcon: 'calendar-plus',
      component: FlowAppointmentComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static verifyInfo(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Verify',
      nodeIcon: 'calendar-check',
      component: FlowDataComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
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

  public static reasonForCall(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Reason For Call',
      nodeIcon: 'address-book',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'reason-for-call',
        data: {
          title: 'Reason for Call',
        }
      }
    });
  }


  public static recap(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Recap',
      nodeIcon: 'address-book',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'recap',
        data: {
          title: 'Recap',
        }
      }
    });
  }

  public static end(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'End',
      nodeIcon: 'flag-checkered',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'end',
        data: {
          title: 'End',
          lastStep : true
        }
      },
      valid: true
    });
  }

  public static takeNotes(beforeRoutingTrigger: any = undefined, afterRoutingTrigger: any = undefined): FlowStep {
    return new FlowStep({
      nodeText: 'Text Notes',
      nodeIcon: 'note-sticky',
      component: FlowTextComponent.reference,
      beforeRoutingTrigger,
      afterRoutingTrigger,
      state: {
        template: 'take-notes',
        data: {
          title: 'Notes',
        }
      }
    });
  };


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
