import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { FiizListComponent } from '../../common/components/ui/list/list.component';

const routes: Routes = [
  {
    path: 'module',
    component: DataComponent,
    children: [
      {
        path: 'lead',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'contact',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'call',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'deal',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'event',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'campaign',
        component: FiizListComponent,
        outlet: 'aux'
      },
      {
        path: 'leadSource',
        component: FiizListComponent,
        outlet: 'aux'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRouting {
}
