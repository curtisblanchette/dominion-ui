import { Component } from '@angular/core';
import { ModuleTypes } from '../../../data/entity-metadata';
import { Fields } from '../../../common/models/event.model';
import { CustomDataService } from '../../../data/custom.dataservice';
import { DominionType } from '../../../common/models';
import { DefaultDataServiceFactory } from '@ngrx/data';
import { take } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'outcome-form',
  templateUrl: './outcome-form.component.html',
  styleUrls: ['../../../../assets/css/_container.scss', './outcome-form.component.scss']
})
export class OutcomeFormComponent {
  public id: string | null;
  public data: any;
  public ModuleTypes: any;
  public fields: any = Fields;
  public callService: CustomDataService<DominionType>;
  public dealService: CustomDataService<DominionType>;
  public eventService: CustomDataService<DominionType>;

  public event: any;
  public deal: any;
  public calls: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataServiceFactory: DefaultDataServiceFactory,
  ) {
    this.ModuleTypes = ModuleTypes;
    this.callService = this.dataServiceFactory.create(ModuleTypes.CALL) as CustomDataService<DominionType>;
    this.eventService = this.dataServiceFactory.create(ModuleTypes.EVENT) as CustomDataService<DominionType>;
    this.dealService = this.dataServiceFactory.create(ModuleTypes.DEAL) as CustomDataService<DominionType>;


    route.paramMap.pipe(untilDestroyed(this)).subscribe(params => {
      this.id = params.get('id');
      if(this.id){
        this.eventService.getById(this.id).pipe(take(1)).subscribe(event => {
          this.event = event;
          this.dealService.getById(this.event.dealId).pipe(take(1)).subscribe(deal =>{
            this.deal = deal;
            this.callService.getWithQuery({dealId: this.deal.id}).pipe(take(1)).subscribe((res: any) => {
              this.calls = res.rows;
            });
          });
        });
      }

    });



  }
}
