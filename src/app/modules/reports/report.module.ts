import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from './reports.component';
import { ReportsRouting } from './reports.routing';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reports.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ReportsEffects } from './store/reports.effects';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
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
