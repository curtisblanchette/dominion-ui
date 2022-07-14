import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { OutcomeFormRouting } from './outcome-form.routing';
import { OutcomeFormComponent } from './outcome-form/outcome-form.component';
import { NoOutcomeListComponent } from './no-outcome-list/no-outcome-list.component';

@NgModule({
  declarations: [
    NoOutcomeListComponent,
    OutcomeFormComponent
  ],
  imports: [
    CommonModule,
    FiizUIModule,
    OutcomeFormRouting
  ]
})
export class OutcomeFormModule {
}
