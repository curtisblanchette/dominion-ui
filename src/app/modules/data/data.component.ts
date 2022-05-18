import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataState } from './store/data.reducer';
import { Store } from '@ngrx/store';
import * as fromData from './store/data.reducer';
import { IListOptions } from '../../common/components/ui/list/list.component';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit, OnDestroy {

  public destroyed$: Subject<boolean> = new Subject<boolean>();

  private listOptions: IListOptions = {
    searchable: true,
    editable: true,
    columns: [],
    perPage: 0
  };

  constructor(
    private store: Store<DataState>,
    private router: Router
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      console.log('here');
      this.router.navigate(['/data/']);
    }
    // this.store.select(fromData.selectPerPage).pipe(takeUntil(this.destroyed$)).subscribe(perPage => {
    //   this.listOptions.perPage = perPage;
    // });
  }

  public async ngOnInit() {
    this.renderComponent('lead');
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
  }

  public onActivate($event: any) {
    console.log('$event', $event);
  }

  public renderComponent(module: string) {
    return this.router.navigate(['/data', {outlets: {'aux': [`${module}`]}}], {
      state: {
        options: this.listOptions,
        module: module,
        editPath: {
          route: ['/data', {outlets: {'aux': ['edit']}}],
          extras: {
            state: {
              module: module,
              record: null
            }
          }
        }
      }
    });
  }
}
