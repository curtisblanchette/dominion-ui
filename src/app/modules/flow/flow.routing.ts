import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowComponent } from './flow.component';
import { FlowDataComponent, FlowTextComponent, FlowIntroComponent, FlowListComponent } from './_core/';

const routes: Routes = [
  {
    path: 'f',
    component: FlowComponent,
    children: [
      {
        path: 'intro',
        component: FlowIntroComponent,
        outlet: 'aux'
      },
      {
        path: 'data',
        component: FlowDataComponent,
        outlet: 'aux'
      },
      {
        path: 'text',
        component: FlowTextComponent,
        outlet: 'aux'
      },
      {
        path: 'list',
        component: FlowListComponent,
        outlet: 'aux'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlowRouting {
}
