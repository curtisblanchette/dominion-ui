import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { PageNotFoundComponent } from './modules/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    // canActivate: [GuardsGuard],
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner'] },
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'flow',
    loadChildren: () => import('./modules/flow/flow.module').then(m => m.FlowModule)
  },
  {
    path: 'system',
    loadChildren: () => import('./modules/system/system.module').then(m => m.SystemModule)
  },  
  { 
    path: '**',
    pathMatch : 'full',
    component : PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
