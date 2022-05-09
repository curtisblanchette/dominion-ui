import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { LeadComponent } from './_core/components/lead/lead.component';

const routes: Routes = [
    {
        path: 'module',
        component: DataComponent,
        children: [
            {
                path: 'lead',
                component: LeadComponent,
                outlet: 'aux'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataRouting {
}