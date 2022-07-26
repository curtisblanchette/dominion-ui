import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataState } from './store/data.reducer';
import { Store } from '@ngrx/store';
import { FiizListComponent, IListOptions } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { models } from '../../common/models';

@UntilDestroy()
@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit {

  private readonly listOptions: IListOptions;
  public contentClass: string;

  constructor(
    private store: Store<DataState>,
    private router: Router
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      this.router.navigate(['/data/list']);
    }
    this.listOptions = {
      searchable: true,
      editable: true,
      columns: [],
    };
  }

  public async ngOnInit() {
    this.renderComponent('lead');
  }

  public onActivate(componentRef: FiizListComponent | FiizDataComponent){
    // if it's a list, subscribe to the `values` emitter
    if(componentRef instanceof FiizListComponent) {
      this.contentClass = 'list';
      componentRef.values.pipe(untilDestroyed(this)).subscribe(res => {
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
      })
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
          createNew : true,
          columns: []
        },
        page: 1,
      }
    });
  }
}
