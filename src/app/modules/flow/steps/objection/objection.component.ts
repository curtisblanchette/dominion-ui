import { Component, Input, OnDestroy, OnInit, QueryList, ViewChildren, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from "@angular/router";
import { FlowService } from "../../flow.service";
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { ModuleTypes } from '../../../../data/entity-metadata';
import { HttpClient } from '@angular/common/http';
import * as fromFlow from '../../store/flow.reducer';
import { Fields as CallFields } from '../../../../common/models/call.model';
import { FiizDataComponent } from '../../../../common/components/ui/data/data.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'flow-objection',
  templateUrl: './objection.component.html',
  styleUrls: ['../_base.scss', './objection.component.scss']
})
export class FlowObjectionComponent extends EntityCollectionComponentBase implements OnInit, OnDestroy, OnChanges {

  @Input('data') public override data: any;
  @Input('module') public override module: any;
  @Input('options') public override options: any;

  @ViewChildren(FiizDataComponent) dataComponents: QueryList<FiizDataComponent>;

  public static reference: string = 'FlowObjectionComponent';
  private flowStepId: string;
  public ModuleTypes: any;
  public fields: any = CallFields;
  public selectedId:number;
  public resolution: { [key:number]: any } = {
    1 : { // too expensive
      steps : [
        'You are correct, the prices are expensive',
        'Since you would be speaking to the experts, our attorneys have created a system that will let us know if you have any option available before setting any consultation.',
        'May I ask, have you tried fixing your legal status before or is this the first time you\'re look into it?',
        'What country are you originally from?',
        'How long have you been in the United States?'
      ],
      secret : [
        'It is crucial to agree with them that the consultation fee is too expensive! <br><br> If they don\'t respond, or simply respond in their own words of how it\'s too expensive... Skip agreeing with them and go straight to step 2, 3, etc. Always finish with a question.'
      ]
    },
    2 : { // Uncertain it will work.
      steps : [
        'In the 15 years we have been working with the immigrant community we have helped over 50,000 people fix their legal status.',
        'Unfortunately, no attorney can offer you any guarantees as we are subject to the law, however, we always guarantee you will get the same work and dedication we gave to those 50,000 so you can be 50k and 1 more!',
        'Have you tried doing this before or is this your first time looking into it?',
        'How long have you been in the US?',
        'May I ask where you would be right now if you would\'ve had your legal status 5 years ago? (power question)',
        'What is the first thing you would like to do if you had your green card today?'
      ],
      secret : [
        'When people are fearful of starting a process, we want to focus on the positive outcome of what will happen if they proceed with the case. Ask power questions that will make them think about a positive future for their family. You can also ask questions that inspire fear towards immigration such as: "Do you have an attorney backing you up right now if ICE tried to deport you right now?" or "What would your life look like if you or your family members were separated by ICE today?'
      ]
    },
    3 : { // Uncertain of legitimacy
      steps : [
        'In the 15 years we have been working with the immigrant community we have helped over 50,000 people fix their legal status.',
        'We\'d love you to be 50k and 1, however, we know there are many attorneys out there that are not trustworthy. Our attorney founder of the firm was also an immigrant, so she understands the struggles of fighting for a legal status.',
        'Did you you have a bad experience in the past with other attorneys?',
        'How long has it been since you tried looking into fixing your legal status?'
      ],
      secret : [
        'Always focus on the fact that we are helping immigrants, not working against them. Get creative on what and how you answer, however, it\'s important we speak smoothly and with a smile during this portion. If we sound agitated, frustrated or mad, they will hang up. This is where our tone of voice will have to transform into the friendliest tone possible so they can trust us. Remember, most immigrants that ask this have gone through scams with other attorneys or simply fear getting scammed/deported.'
      ]
    },
    4 : { // Fear to share credit card.
      steps : [
        'I understand; a credit card is confidential information.',
        'Our firm\'s system only allows us to remove the exact amount of the consultation for your security. Nonetheless, we always encourage our potential clients to use a debit card for their own safety.',
        'Would you prefer to use in that case your debit card or a family member\'s debit card?'
      ],
      secret : [
        'This one is pretty straight forward. We want to sound confident but smiling at all times. This is a common objection that can be easily overcome by saying exactly that. If the person continues objecting, feel free to offer other payment options available or a free consultation on Wednesday without a guarantee of getting a consultation in place soon. Again, the secret is to sound confident on this one.'
      ]
    },
    5: { // not ready
      steps : [
        'Of course!',
        'We get hundreds of calls a day.',
        'When are you looking to call back so I can let my co-workers know in case I\'m not here so they can help you?'
      ],
      secret: ''
    },
    6: { // office too far away
      steps : [
        'We have offices all across the US!',
        'If we can\'t find something closer to you, I could try to refer you to one of our partner firms within your area.',
      ],
      secret: ''
    },
    7 : { // Needs to talk to spouse.
      steps : [
        'Absolutely! Please review with your loved ones your options and let us know what you decide.',
        'Based on the notes, it looks like we can find a way to help you get a legal status and in our line of work, we get to see the good and the bad of when people decide to start or when they decide to wait, not knowing when is the next time a loved one will get deported.',
        'When are you planning to start?',
        'What is stopping you from scheduling a consultation?'
      ],
      secret : [
        'The secret to lack of urgency is simply overconfidence due to being in the US for many years, money or fear. We want to dig in by asking questions. If that takes us to more objections, we continue following the 3 steps to overcome objections until they give us a yes to the consultation.'
      ]
    },
    8 : { // Need to think about it
      steps : [
        'Absolutely! Please. Think over your options and let us know what you decide.',
        'Based on the notes, it looks like we can find a way to help you get a legal status and in our line of work, we get to see the good and the bad of when people decide to start or when they decide to wait, not knowing when is the next time a loved one will get deported.',
        'When are you planning to start?',
        'What is stopping you from scheduling a consultation?'
      ],
      secret : [
        'The secret to lack of urgency is simply overconfidence due to being in the US for many years, money or fear. We want to dig in by asking questions. If that takes us to more objections, we continue following the 3 steps to overcome objections until they give us a yes to the consultation.'
      ]
    },
    9 : { // I want to know the price first what will the case cost me
      steps : [
        'Absolutely, we all want to know how much this investment will affect our wallet.',
        'I would be happy to give you a brief estimate, however, our cases pricing vary depending on each person\'s case.',
        'In your case, may I ask when was the first time you entered the United states?',
        'May I ask, what country are you from?',
        'Have you tried doing this process before?',
        'When was the last time you tried a legal process?'
      ],
      secret : [
        'At this point, you will need to ask a question depending on what\'s next in your script. Whether it\'s gathering their contact information, continuing with your usual call script or performing the immigration questionnaire. It\'s important we do not stutter when overcoming these objections, therefore, we always suggest a 15 minute roleplay every morning within agents to help them practice this before doing it live on a phone call.'
      ]
    },
    10: { // Calling for information
      steps : [
        'Of course!',
        'We get hundreds of calls a day.',
        'When are you looking to call back so I can let my co-workers know in case I\'m not here so they can help you?'
      ],
      secret: ''
    },
    11: { // Other
      steps: [
        'Please enter a reason'
      ],
      secret: ''
    }

  }

  constructor(
    private store: Store<AppState>,
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public http: HttpClient,
    public renderer:Renderer2
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    const state = (<any>router.getCurrentNavigation()?.extras.state);
    this.ModuleTypes = ModuleTypes;

    if (state && Object.keys(state).length) {
      this.module = state.module;
      this.options = state.options;
      this.data = state.data;
    }

    this.store.select(fromFlow.selectCurrentStepId).pipe(untilDestroyed(this)).subscribe(currentStepId => {
      if(currentStepId) {
        this.flowStepId = currentStepId;
      }
    });

  }

  public ngOnChanges(simpleChanges: SimpleChanges) {
    console.log(simpleChanges);
  }

  async ngOnInit() {
    this.store.select(fromFlow.selectVariableByKey('objectionId')).subscribe(val => {
      this.selectedId = val;
    });
  }

  public async onSave():Promise<any> {
    this.dataComponents.map( (cmp:FiizDataComponent, index:number) => {
      cmp.save(false);
    });
  }

  public goToSetAppointment() {
    const setAppointmentStep = this.flowService.builder.process.steps.find(step => step.component === 'FlowAppointmentComponent');
    if(setAppointmentStep?.id) {
      this.flowService.goTo(setAppointmentStep.id);
    }
  }

  public async endCall(){
    const id = await this.flowService.getVariable('objectionId');

    const stepId = this.flowService.builder.process.steps.find( step => step.component === 'FlowObjectionComponent' )?.id as string;
    this.flowService.addVariables({
      call_objectionId: id,
      objectAndEndCall: true
    }, stepId);

    return this.flowService.next();
  }

  public handleChange(objection: any) {
    this.flowService.updateStep(this.flowStepId, {variables: {call_objectionId: objection.id}, valid: true});
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
