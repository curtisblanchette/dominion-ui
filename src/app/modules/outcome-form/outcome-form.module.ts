import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutcomeFormComponent } from './outcome-form.component';
import { FiizUIModule } from '../../common/components/ui/fiiz-ui.module';
import { OutcomeFormRouting } from './outcome-form.routing';
import { NavigationService } from '../../common/navigation.service';

@NgModule({
    declarations: [
        OutcomeFormComponent,
    ],
    imports: [
        CommonModule,
        FiizUIModule,
        OutcomeFormRouting
    ],
    providers: [
        NavigationService
    ]
})
export class OutcomeFormModule { }