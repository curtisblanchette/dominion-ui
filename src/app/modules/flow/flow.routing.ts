import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlowComponent } from "./flow.component";
import { DataComponent, TextComponent } from "./components";
import { IntroComponent } from "./components/intro.component";

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
