import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowComponent } from './flow.component';
import { FlowDataComponent, FlowTextComponent, FlowObjectionComponent, FlowListComponent, FlowAppointmentComponent } from './index';
import { sidebarRoutes } from '../data/data.routing';

const routes: Routes = [
  {
    path: '',
    component: FlowComponent,
    children: [
      {
        path: 'objection',
        component: FlowObjectionComponent,
        outlet: 'flow'
      },
      {
        path: 'data/:id',
        children: sidebarRoutes[0].children.map(route => ({
          path: route.path,
          component: FlowDataComponent,
          outlet: 'flow',
        }))
      },
      {
        path: 'text',
        component: FlowTextComponent,
        outlet: 'flow'
      },
      {
        path: 'list',
        children: sidebarRoutes[0].children.map(route => ({
          path: route.path,
          component: FlowListComponent,
          outlet: 'flow',
        }))
      },
      {
        path: 'event',
        component: FlowAppointmentComponent,
        outlet: 'flow'
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
