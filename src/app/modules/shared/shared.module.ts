import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingComponent } from '../../common/loading/loading.component';
import { SafePipe } from '../../common/pipes/safe..pipe';
// import { DirectivesModule } from '../../common/directives/directives.module';
// import { ChartModule } from 'angular2-chartjs';
// import { FiizDoughnutComponent } from '../../common/components/charts/doughnut/doughnut.component';
// import { CollapseCardComponent } from '../../common/components/cockpit/collapse-card/collapse-card.component';
// import { SystemStatusBannerComponent } from '../../common/components/cockpit/system-status-banner/system-status-banner.component';
import { FormsModule } from '@angular/forms';
// import { FiltersComponent } from '../../common/components/filters/filters.component';
// import { TranslateModule } from '@ngx-translate/core';
// import { CashFlowComponent } from '../dashboards/cockpit/cash-flow/cash-flow.component';
// import { OutliersDropdownComponent } from '../../common/components/cockpit/outliers-dropdown/outliers-dropdown.component';
// import { EditionBlockComponent } from '../../common/components/edition-block/edition-block.component';

@NgModule({
  imports: [
    CommonModule,
    // DirectivesModule,
    // ChartModule,
    FormsModule,
    // TranslateModule
  ],
  declarations: [
    // EditionBlockComponent,
    // FiltersComponent,
    LoadingComponent,
    SafePipe,
    // FiizDoughnutComponent,
    // CollapseCardComponent,
    // SystemStatusBannerComponent,
    // CashFlowComponent,
    // OutliersDropdownComponent
  ],
  exports: [
    CommonModule,
    LoadingComponent,
    // FiizDoughnutComponent,
    SafePipe,
    // CollapseCardComponent,
    // SystemStatusBannerComponent,
    // FiltersComponent,
    // CashFlowComponent,
    // OutliersDropdownComponent
  ]
})
export class SharedModule {

}

