import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ModuleTypes } from '../../data/entity-metadata';
import { FiizListComponent } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';
import { models } from '../../common/models';

@UntilDestroy()
@Component({
  templateUrl: './outcome-form.component.html',
  styleUrls: ['./outcome-form.component.scss']
})
export class OutcomeFormComponent implements OnInit {

  public moduleName:string = ModuleTypes.EVENT;
  public pathName:string = 'outcome-form';

  constructor(
    private router: Router,
  ) {
    if (this.router.routerState.snapshot.url.indexOf('(aux:') !== -1) {
      this.router.navigate([`/${this.pathName}/list`]);
    }
  }

  public async ngOnInit() {
    this.renderComponent( ModuleTypes.EVENT );
  }

  public renderComponent(module: string) {
    return this.router.navigate([`/${this.pathName}/list`, {outlets: {'aux': [module]}}], {
      state: {
        module: module,
        data: {},
        options: {
          searchable: true,
          editable: false,
          createNew: false,
          query : { savedSearch : 'no-outcome-list'},
          columns: []
        },
        page: 1,
      }
    });
  }

  public onActivate(componentRef: FiizListComponent | FiizDataComponent){
    // if it's a list, subscribe to the `values` emitter
    if(componentRef instanceof FiizListComponent) {
      componentRef.values.pipe(untilDestroyed(this)).subscribe(res => {
        console.log('res',res);
        if( res.record && res.record.id ){
          this.router.navigate([`/${this.pathName}/edit/${res.record.id}`, { outlets: {'aux': [res.module]} }], {
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
    }
  }

  

}
