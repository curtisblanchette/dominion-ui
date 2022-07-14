import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoOutcomeListComponent } from './no-outcome-list/no-outcome-list.component';
import { OutcomeFormComponent } from './outcome-form/outcome-form.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: NoOutcomeListComponent
      },
      {
        path: ':id',
        component: OutcomeFormComponent
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
