import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './common/guards/role.guard';
import { PageNotFoundComponent } from './common/components/page-not-found/page-not-found.component';
import { SystemResolver } from './modules/system/system.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner', 'consultant', 'agent'] },
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'dashboard',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner', 'consultant', 'agent'] },
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'flow',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner', 'consultant', 'agent'] },
    loadChildren: () => import('./modules/flow/flow.module').then(m => m.FlowModule)
  },
  {
    path: 'settings',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner'] },
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'system',
    canActivate: [RoleGuard],
    resolve: {
      system: SystemResolver
    },
    data: { roles: ['system'] },
    loadChildren: () => import('./modules/system/system.module').then(m => m.SystemModule)
  },
  {
    path: 'data',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner'] },
    loadChildren: () => import('./modules/data/data.module').then(m => m.DataModule)
  },
  {
    path: 'no-outcome',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner', 'consultant'] },
    loadChildren: () => import('./modules/outcome-form/outcome-form.module').then(m => m.OutcomeFormModule)
  },
  {
    path: 'reports',
    canActivate: [RoleGuard],
    data: { roles: ['system', 'admin', 'owner', 'consultant'] },
    loadChildren: () => import('./modules/reports/report.module').then(m => m.ReportsModule)
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
