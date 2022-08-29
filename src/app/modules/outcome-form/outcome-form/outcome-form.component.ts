import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ModuleTypes } from '../../../data/entity-metadata';
import { Fields } from '../../../common/models/event.model';
import { Fields as ContactFields } from '../../../common/models/contact.model';
import { CustomDataService } from '../../../data/custom.dataservice';
import { DominionType } from '../../../common/models';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { firstValueFrom, take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { NavigationService } from '../../../common/navigation.service';
import { FiizDataComponent } from '../../../common/components/ui/data/data.component';
import { environment } from '../../../../environments/environment';

@UntilDestroy()
@Component({
  selector: 'outcome-form',
  templateUrl: './outcome-form.component.html',
  styleUrls: ['../../../../assets/css/_container.scss', './outcome-form.component.scss']
})
export class OutcomeFormComponent implements AfterViewInit, OnInit {

  public id: string | null;
  public contactId: string;
  public data: any;
  public ModuleTypes: any;
  public fields: any = Fields;
  public dealService: CustomDataService<DominionType>;
  public eventService: CustomDataService<DominionType>;
  public contactService: CustomDataService<DominionType>;

  public event: any;
  public deal: any;
  public notes: any[] = [];

  public allLoaded:boolean = false;
  public notesFetched:boolean = false;
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

  constructor(
    private route: ActivatedRoute,
    private dataServiceFactory: DefaultDataServiceFactory,
    public navigation: NavigationService,
    private http:HttpClient
  ) {
    this.ModuleTypes = ModuleTypes;
    this.eventService = this.dataServiceFactory.create(ModuleTypes.EVENT) as CustomDataService<DominionType>;
    this.dealService = this.dataServiceFactory.create(ModuleTypes.DEAL) as CustomDataService<DominionType>;
    this.contactService = this.dataServiceFactory.create(ModuleTypes.CONTACT) as CustomDataService<DominionType>;
  }

  public async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if( this.id ){
      await this.getData(this.id);
    }
  }

  public async getData( id:string ) {
    this.event = await firstValueFrom( this.eventService.getById(id).pipe(take(1)) );
    if( this.event ){
      this.contactId = this.event.contactId;

      if( this.event && this.event.dealId ){
        this.dealService.getById(this.event.dealId).pipe(take(1)).subscribe(deal => {
          this.deal = deal;
          this.http.get(`${environment.dominion_api_url}/notes?dealId=${this.deal.id}`).pipe(take(1)).subscribe( (res:any) => {            
            if( res ){
              this.notes = res;
            }
            this.notesFetched = true;
          });
        });
      }

    }
    this.allLoaded = true;
  }

  ngAfterViewInit(): void {
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

      this.eventService.update( eventData ).pipe(take(1)).subscribe();
      this.contactService.update( contactData ).pipe(take(1)).subscribe();

    } else {
      console.warn('Form in Invalid');
    }

  }

}
