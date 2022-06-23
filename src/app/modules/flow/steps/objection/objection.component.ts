import { AfterViewInit, Component, Input, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from "@angular/router";
import { FlowService } from "../../flow.service";
import { DefaultDataServiceFactory, EntityCollectionServiceFactory } from '@ngrx/data';
import { EntityCollectionComponentBase } from '../../../../data/entity-collection.component.base';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/app.reducer';
import { FormBuilder } from '@angular/forms';
import { DropdownItem } from '../../../../common/components/interfaces/dropdownitem.interface';
import { FiizSelectComponent } from '../../../../common/components/ui/forms';
import { firstValueFrom, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { uriOverrides } from '../../../../data/entity-metadata';
import { CustomDataService } from '../../../../data/custom.dataservice';
import { HttpClient } from '@angular/common/http';
import * as flowActions from '../../store/flow.actions';

@Component({
  selector: 'flow-objection',
  templateUrl: './objection.component.html',
  styleUrls: ['../_base.scss', './objection.component.scss']
})
export class FlowObjectionComponent extends EntityCollectionComponentBase implements OnDestroy, AfterViewInit {

  @Input('data') public override data: any;
  @Input('module') public override module: any;
  @Input('options') public override options: any;

  @ViewChild(FiizSelectComponent) dropdown: FiizSelectComponent;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    entityCollectionServiceFactory: EntityCollectionServiceFactory,
    dataServiceFactory: DefaultDataServiceFactory,
    public flowService: FlowService,
    public http: HttpClient
  ) {
    super(router, entityCollectionServiceFactory, dataServiceFactory);

    const state = (<any>router.getCurrentNavigation()?.extras.state);

    if (state && Object.keys(state).length) {
      this.module = state.module;
      this.options = state.options;
      this.data = state.data;
    }
  }

  public async ngAfterViewInit() {
    // TODO determine if it's a call or event objection
    // the lookup values might be different
    const data: any = await firstValueFrom(this.http.get(`${environment.dominion_api_url}/${uriOverrides['callObjection']}`)) as DropdownItem[];
    this.dropdown.items$ = of(CustomDataService.toDropdownItems(data));
  }

  public save() {

  }

  public handleChange(objection: any) {
    this.flowService.addVariables({call_objectionId: objection.id});
    this.store.dispatch(flowActions.SetValidityAction({payload: true}));
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
