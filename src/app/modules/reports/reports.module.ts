import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TotalPipelineComponent } from './total-pipeline/total-pipeline.component';
import { ReportsRouting } from './reports.routing';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reports.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReportsEffects } from './store/reports.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamReportComponent } from './team/team.component';

@NgModule({
  declarations: [
    TotalPipelineComponent,
    TeamReportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRouting,
    FiizUIModule,
    StoreModule.forFeature('reports', reducer),
    EffectsModule.forFeature([ReportsEffects]),
  ],
  providers: [
  ]
})
export class ReportsModule {
}
