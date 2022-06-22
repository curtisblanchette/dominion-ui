import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { FlowHostDirective, FlowDataComponent, FlowIntroComponent, FlowListComponent, FlowTextComponent, FlowNotesComponent, FlowTimelineComponent, FlowAppointmentComponent } from './index';
import { CommonModule } from "@angular/common";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/flow.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { EffectsModule } from '@ngrx/effects';
import { FlowEffects } from './store/flow.effects';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [
    FlowComponent,
    FlowNotesComponent,
    FlowTimelineComponent,
    FlowIntroComponent,
    FlowTextComponent,
    FlowDataComponent,
    FlowListComponent,
    FlowAppointmentComponent,
    FlowHostDirective
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
    FlowService
  ]
})
export class FlowModule {}
