import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TotalPipelineComponent } from './total-pipeline/total-pipeline.component';
import { TeamReportComponent } from './team/team.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'total-pipeline',
        component: TotalPipelineComponent,
        pathMatch: 'full'
      },
      {
        path: 'team',
        component: TeamReportComponent,
        pathMatch: 'full'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRouting {
}
