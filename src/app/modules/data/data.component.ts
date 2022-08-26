import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataState } from './store/data.reducer';
import { Store } from '@ngrx/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FiizListComponent, IListOptions } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { models } from '../../common/models';
import { NavigationService } from '../../common/navigation.service';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { uriOverrides } from '../../data/entity-metadata';

@UntilDestroy()
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit {

  private readonly listOptions: IListOptions;
  public contentClass: string;

  constructor(
    private store: Store<DataState>,
    private router: Router,
    private navigation: NavigationService,
    private http: HttpClient
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      this.router.navigate(['/data/list']);
    }
    this.listOptions = {

      searchable: true,
      editable: true,
      columns: [],
      query: {},
      controls: {
        perPage: true,
        pagination: true,
        createNew: true
      }
    };
  }

  public async ngOnInit() {
    this.renderComponent('lead');
  }

  public onActivate(componentRef: FiizListComponent | FiizDataComponent){
    // if it's a list, subscribe to the `values` emitter
    if(componentRef instanceof FiizListComponent) {
      this.contentClass = 'list';
      componentRef.onEdit.pipe(untilDestroyed(this)).subscribe(res => {
        if( res.record && res.record.id ){
          this.router.navigate([`/data/edit/${res.record.id}`, { outlets: {'aux': [res.module]} }], {
            state: {
              module: res.module,
              data: {},
              options: {
                state : 'edit',
                controls: true,
                fields: Object.keys(models[res.module])
              }
            }
          });
        }
      });

      componentRef.onCreate.pipe(untilDestroyed(this)).subscribe(res => {
        this.router.navigate([`/data/edit/new`, { outlets: {'aux': [res.module]} }], {
          state: {
            module: res.module,
            data: {},
            options: {
              state : 'create',
              controls: true,
              fields: Object.keys(models[res.module])
            }
          }
        });
      });

      componentRef.onDelete.pipe(untilDestroyed(this)).subscribe(res => {
        if( res.record && res.record.id ){
          const url = `${environment.dominion_api_url}/${uriOverrides[res.module]}/${res.record.id}`;
          firstValueFrom(this.http.delete(url)).then( (response) => {
            if( response instanceof HttpErrorResponse ){
              
            } else {
              componentRef.data$.forEach((items) => {
                const index = items.findIndex( item => item?.id === res.record.id );
                if( index !== -1 ){
                  delete items[index];
                  componentRef.selected = null;
                  componentRef._dynamicCollectionService.removeOneFromCache(res.record.id);
                }
              });
            }
          }).catch( (err) => {
            console.error(err);
          });
        }
      });

    }

    if(componentRef instanceof FiizDataComponent) {
      componentRef.onSuccess.pipe(untilDestroyed(this)).subscribe(res => {
        this.navigation.back();
      });
    }
  }

  public renderComponent(module: string) {
    return this.router.navigate(['/data/list', {outlets: {'aux': [module]}}], {
      state: {
        module: module,
        data: {},
        options: {
          searchable: true,
          loadInitial: true,
          editable: true,
          columns: [],
          controls: {
            perPage: true,
            pagination: true,
            createNew : true,
          }
        },
        page: 1,
      }
    });
  }
}
