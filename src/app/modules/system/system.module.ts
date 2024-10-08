import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { SystemComponent } from "./system.component";
import { SystemRouting } from "./system.routing";
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/system.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SystemEffects } from './store/system.effects';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    SystemRouting,
    SharedModule,
    CommonModule,
    StoreModule.forFeature('system', reducer),
    EffectsModule.forFeature([SystemEffects]),
    FiizUIModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [

  ]
})
export class SystemModule { }
