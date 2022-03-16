import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

const routes: Routes = [
	{ path: '', component : LoginComponent },
	{ path : 'login', loadChildren: () => import('./login.modules').then(m => m.LoginModule) }
];

export const routing: ModuleWithProviders<any> = RouterModule.forChild(routes);