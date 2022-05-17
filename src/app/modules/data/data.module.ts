import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataComponent } from './data.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { DataRouting } from './data.routing';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/data.reducer';
import { EffectsModule } from '@ngrx/effects';
import { FlowEffects } from '../flow/store/flow.effects';

@NgModule({
  declarations: [
    DataComponent,
    SidebarComponent
  ],
  imports: [
    StoreModule.forFeature('data', reducer),
    EffectsModule.forFeature([FlowEffects]),
    CommonModule,
    FiizUIModule,
    DataRouting
  ],
  providers: []
})
export class DataModule {
}
