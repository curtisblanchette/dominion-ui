import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ModuleTypes } from '../../../data/entity-metadata';
import { Fields } from '../../../common/models/event.model';
import { Fields as ContactFields } from '../../../common/models/contact.model';
import { DominionType } from '../../../common/models';
import { DefaultDataServiceFactory, EntityCollectionService, EntityCollectionServiceFactory } from '@ngrx/data';
import { take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NavigationService } from '../../../common/navigation.service';
import { FiizDataComponent } from '../../../common/components/ui/data/data.component';
import { environment } from '../../../../environments/environment';
import { FiizTextAreaComponent } from '../../../common/components/ui/forms';
import { EntityCollectionComponentBase } from '../../../data/entity-collection.component.base';

@UntilDestroy()
@Component({
  selector: 'outcome-form',
  templateUrl: './outcome-form.component.html',
  styleUrls: ['../../../../assets/css/_container.scss', './outcome-form.component.scss']
})
export class OutcomeFormComponent extends EntityCollectionComponentBase implements AfterViewInit, OnInit {

  public id: string | null;
  public contactId: string;
  public ModuleTypes: any;
  public fields: any = Fields;
  public dealService: EntityCollectionService<DominionType>;
  public contactService: EntityCollectionService<DominionType>;

  public event: any;
  public deal: any;
  public notes: any[] = [];

  public formValues:{ [ key:string ] : any } = {};
  public formValidation:{ [ key:string ] : boolean } = {};

  public contactOptions = {
    controls: false,
    state: 'edit',
    dictation: '',
    fields: [
      ContactFields.FIRST_NAME,
      ContactFields.LAST_NAME,
      ContactFields.EMAIL,
      ContactFields.PHONE
    ]
  };

  public eventOptions = {
    controls: false,
    state: 'edit',
    dictation: '',
    fields: [Fields.OUTCOME_ID]
  };

  @ViewChildren(FiizDataComponent) childrenComponent: QueryList<FiizDataComponent>;
  @ViewChild(FiizTextAreaComponent) textArea:FiizTextAreaComponent;

  constructor(
    private route: ActivatedRoute,
    public navigation: NavigationService,
    private http:HttpClient,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    router: Router,
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);
    this.ModuleTypes = ModuleTypes;
    this.module = ModuleTypes.EVENT;
    this.dealService = this.createService(ModuleTypes.DEAL, entityCollectionServiceFactory);
    this.contactService = this.createService(ModuleTypes.CONTACT, entityCollectionServiceFactory);
  }

  public async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  public async getData() {
    this._dynamicCollectionService.getByKey(this.id);
    this._dynamicCollectionService.setFilter({id: this.id}); // this modifies filteredEntities$ subset
  }

  async ngAfterViewInit(): Promise<void> {
    if( this.id ){
      await this.getData();

      this.data$.subscribe((events: any) => {
        if(events.length) {
          this.event = events[0];
          this.contactId = this.event.contactId;

          if (this.event && this.event.dealId) {
            this.dealService.getByKey(this.event.dealId).pipe(take(1)).subscribe(deal => {
              this.deal = deal;

              this.http.get(`${environment.dominion_api_url}/notes?dealId=${this.deal.id}`).pipe(take(1)).subscribe( (res:any) => {
                if (res) {
                  this.notes = res;
                }
              });
            });
          }
        }


      });
    }

    this.childrenComponent.changes.pipe(untilDestroyed(this)).subscribe((comps: QueryList<FiizDataComponent>) => {
      if( comps ){
        for( let c of comps ){
          c.isValid.subscribe( valid => {
            this.formValidation[c.module] = valid;
          });
          c.values.subscribe( value => {
            this.formValues[c.module] = value;
          });
        }
      }
    });
  }

  get formIsValid(){
    return Object.values(this.formValidation).every(Boolean);
  }

  public async updateEvent(){
    if( this.formIsValid ){
      const eventId = this.formValues[ModuleTypes.EVENT]['id'];

      const eventData = {
        changes : this.formValues[ModuleTypes.EVENT],
        id : this.formValues[ModuleTypes.EVENT]['id']
      }

      const contactData = {
        changes : this.formValues[ModuleTypes.CONTACT],
        id : this.formValues[ModuleTypes.CONTACT]['id']
      }

      delete eventData.changes.id;
      delete contactData.changes.id;

      this._dynamicCollectionService.update( eventData ).pipe(take(1)).subscribe();
      this.contactService.update( contactData ).pipe(take(1)).subscribe();

      if( this.textArea.value ){
        this.http.post(`${environment.dominion_api_url}/events/${eventId}/notes`,{content : this.textArea.value}).pipe(take(1)).subscribe( (res:any) => {});
      }

    } else {
      console.warn('Form in Invalid');
    }

  }

}
