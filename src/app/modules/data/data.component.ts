import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './data.component.html',
  styleUrls: ['../../../assets/css/_container.scss', './data.component.scss']
})
export class DataComponent implements OnInit, OnDestroy {

  public destroyed = new Subject<any>();

  constructor(
    private router: Router
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      console.log('here');
      this.router.navigate(['/data/module/']);
    }
  }

  public async ngOnInit() {
    // this.renderComponent('lead');
  }

  public ngOnDestroy(): void {
    console.log('Yes I\'m Destroyed');
  }

  public onActivate($event: any) {
    console.log('$event', $event);
  }

  public goToModule(module: string) {
    this.renderComponent(module);
  }

  public renderComponent(module: string) {
    return this.router.navigate(['/data/module', {outlets: {'aux': [`${module}`]}}], {
      state: {
        options: {
          searchable: true,
          editable: true,
          perPage: 5,
          columns: []
        },
        module: module,
        onCreate: {
          route: ['/data/module', {outlets: {'aux': ['edit']}}],
          extras: {
            state: {
              module: module
            }
          }
        }
      }
    });
  }
}
