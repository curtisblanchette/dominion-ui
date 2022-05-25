import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DataState } from './store/data.reducer';
import { Store } from '@ngrx/store';
import { FiizListComponent, IListOptions } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit, OnDestroy {

  public destroyed$: Subject<boolean> = new Subject<boolean>();

  private readonly listOptions: IListOptions;

  constructor(
    private store: Store<DataState>,
    private router: Router
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      console.log('here');
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


  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  public onActivate(componentRef: FiizListComponent | FiizDataComponent){
    // if it's a list, subscribe to the `values` emitter
    if(componentRef instanceof FiizListComponent) {
      componentRef.values.subscribe(res => {
        this.router.navigate([`/data/edit/${res.record.id}`, { outlets: {'aux': [res.module]} }], {
          state: {
            module: res.module
          }
        });
      })
      componentRef.onCreate.subscribe(res => {
        this.router.navigate([`/data/edit/new`, { outlets: {'aux': [res.module]} }], {
          state: {
            module: res.module
          }
        });
      });
    }
  }

  public renderComponent(module: string) {
    return this.router.navigate(['/data/list', {outlets: {'aux': [module]}}], {
      state: {
        options: this.listOptions,
        page: 1,
        module: module
      }
    });
  }
}
