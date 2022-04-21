import { NgModule } from '@angular/core';
import { FlowComponent } from "./flow.component";
import { FlowService } from "./flow.service";
import { FlowRouting } from "./flow.routing";
import { DataComponent, TextComponent, ListComponent } from "./_core/step-components";
import { CommonModule } from "@angular/common";
import { IntroComponent } from "./_core/step-components/intro/intro.component";
import { FiizUIModule } from "../../common/components/ui/fiiz-ui.module";
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/flow.reducer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotesComponent, TimelineComponent } from './_core/layout-components';
import { EffectsModule } from '@ngrx/effects';
import { FlowEffects } from './store/flow.effects';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AppointmentComponent } from './_core/step-components/appointment/appointment.component';

@NgModule({
  declarations: [
    FlowComponent,
    NotesComponent,
    TimelineComponent,
    IntroComponent,
    TextComponent,
    DataComponent,
    ListComponent,
    AppointmentComponent
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
