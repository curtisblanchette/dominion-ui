import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OutcomeFormComponent } from './outcome-form.component';
import { FiizListComponent } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';

const routes: Routes = [
  {
    path: '',
    component: OutcomeFormComponent,
    children : [
      {
        path: 'edit/:id',
        children : [
          {
            path : 'event',
            component: FiizDataComponent,
            outlet: 'aux'
          }
        ]
      },
      {
        path: 'list',
        children : [
          {
            path : 'event',
            component: FiizListComponent,
            outlet: 'aux'
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutcomeFormRouting {
}
