import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataState } from './store/data.reducer';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { FiizListComponent, IListOptions } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { models } from '../../common/models';
import { NavigationService } from '../../common/navigation.service';
import { ModuleTypes } from '../../data/entity-metadata';
import { FiizDialogComponent } from '../../common/components/ui/dialog/dialog';
import { Dialog } from '@angular/cdk/dialog';

@UntilDestroy()
@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit {

  private readonly listOptions: IListOptions;
  public contentClass: string;
  private componentRef: FiizListComponent | FiizDataComponent;

  constructor(
    private store: Store<DataState>,
    private router: Router,
    private navigation: NavigationService,
    private http: HttpClient,
    private dialog: Dialog
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
    this.componentRef = componentRef;
    // if it's a list, subscribe to the `values` emitted
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
                grid: {
                  minColWidth: 240,
                },
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
              grid: {
                minColWidth: 240,
              },
              fields: Object.keys(models[res.module])
            }
          }
        });
      });

      componentRef.onDelete.pipe(untilDestroyed(this)).subscribe(res => {
        const moduleName = this.getModuleName(componentRef.module);
        if( res.record && res.record.id ) {
          this.dialog.open(FiizDialogComponent, {
            data: {
              title: `Delete ${moduleName}`,
              body: `
                <div>You are about to delete ${moduleName} ID</div>
                <pre>${res.record.id}</pre>
                <div>Are you sure you want to continue?</div>
              `,
              buttons: {
                cancel: {
                  label: 'Cancel',
                  type: 'cancel'
                },
                submit: {
                  label: `Yes, I'm sure.`,
                  type: 'submit',
                  class: 'warning',
                  fn: this.delete.bind(this)
                }
              }
            }
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

  public delete(): Promise<any> {
    if(this.componentRef instanceof FiizListComponent && this.componentRef.selected?.id) {
      return this.componentRef._dynamicCollectionService.delete( this.componentRef.selected.id ).toPromise();
    }
    return Promise.resolve();
  }

  private getModuleName(module: ModuleTypes) {
    if (module) {
      return module[0].toUpperCase() + module.substring(1, module.length);
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
