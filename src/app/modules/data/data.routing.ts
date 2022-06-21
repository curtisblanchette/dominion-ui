import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './data.component';
import { FiizListComponent } from '../../common/components/ui/list/list.component';
import { FiizDataComponent } from '../../common/components/ui/data/data.component';

export const sidebarRoutes = [
  {
    label: 'Standard',
    children: [
      {
        label: 'Leads',
        path: 'lead',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Contacts',
        path: 'contact',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Deals',
        path: 'deal',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Events',
        path: 'event',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Calls',
        path: 'call',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Campaigns',
        path: 'campaign',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Lead Sources',
        path: 'leadSource',
        icon: 'fa fa-address-book '
      },
      {
        label: 'Offices',
        path: 'office',
        icon: 'fa fa-building '
      },
    ]
  },
  {
    label : 'Other',
    children: [
      {
        path : 'other',
        icon : 'fa fa-address-book '
      }
    ]
  }
];

const routes: Routes = [
  {
    path: '',
    component: DataComponent,
    children: [
      {
        path: 'edit/new',
        children: sidebarRoutes[0].children.map(route => ({
          path: route.path,
          component: FiizDataComponent,
          outlet: 'aux',
        }))
      },
      {
        path: 'edit/:id',
        children: sidebarRoutes[0].children.map(route => ({
          path: route.path,
          component: FiizDataComponent,
          outlet: 'aux',
        }))
      },
      {
        path: 'list',
        children: sidebarRoutes[0].children.map(route =>({
          path: route.path,
          component: FiizListComponent,
          outlet: 'aux'
        })),
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
