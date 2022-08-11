import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowHostDirective, FlowDataComponent, FlowListComponent, FlowTextComponent, FlowTimelineComponent, FlowAppointmentComponent, FlowObjectionComponent } from './index';
import { CommonModule } from "@angular/common";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/flow.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EffectsModule } from '@ngrx/effects';
import { FlowEffects } from './store/flow.effects';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlowRouting } from './flow.routing';
import { FlowBuilder } from './flow.builder';
import { DictationPipe } from '../../common/pipes/dictation.pipe';
import { FlowProcess, FlowBot } from './classes';

@NgModule({
  declarations: [
    FlowComponent,
    FlowTimelineComponent,
    FlowObjectionComponent,
    FlowTextComponent,
    FlowDataComponent,
    FlowListComponent,
    FlowAppointmentComponent,
    FlowHostDirective,
    DictationPipe,
  ],
  imports: [
    StoreModule.forFeature('flow', reducer),
    EffectsModule.forFeature([FlowEffects]),
    FlowRouting,
    CommonModule,
    FiizUIModule,
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [
    FlowBuilder,
    FlowProcess,
    FlowBot
  ],
  exports: [
    DictationPipe
  ]
})
export class FlowModule {}
