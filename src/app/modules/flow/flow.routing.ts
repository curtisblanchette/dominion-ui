import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowComponent } from './flow.component';
import { FlowDataComponent, FlowTextComponent, FlowIntroComponent, FlowListComponent, FlowAppointmentComponent } from './_core/';

const routes: Routes = [
  {
    path: '',
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
        component: FlowComponent,
        children: [
          {
            path: 'lead',
            outlet: 'aux',
            component: FlowListComponent
          },
          {
            path: 'contact',
            outlet: 'aux',
            component: FlowListComponent
          },
          {
            path: 'deal',
            outlet: 'aux',
            component:FlowListComponent
          },
          {
            path: 'event',
            outlet: 'aux',
            component: FlowListComponent
          },
        ]
      },
      {
        path : 'event',
        component : FlowAppointmentComponent,
        outlet : 'aux'
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
