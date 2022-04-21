import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowComponent } from "./flow.component";
import { DataComponent, TextComponent, ListComponent, AppointmentComponent } from "./_core/step-components";
import { IntroComponent } from "./_core/step-components/intro/intro.component";

const routes: Routes = [
  {
    path: 'f',
    component: FlowComponent,
    children: [
      {
        path: 'intro',
        component: IntroComponent,
        outlet: 'aux'
      },
      {
        path: 'data',
        component: DataComponent,
        outlet: 'aux'
      },
      {
        path: 'text',
        component: TextComponent,
        outlet: 'aux'
      },
      {
        path : 'list',
        component : ListComponent,
        outlet : 'aux'
      },
      {
        path : 'event',
        component : AppointmentComponent,
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
