import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FiizInputPercentageComponent,
  FiizSelectComponent,
  FiizDatePickerComponent,
  FiizDatePickerDirective,
  FiizMaxDateDirective,
  FiizMinDateDirective,
  FiizInputComponent,
  FiizTextAreaComponent,
  FiizToggleComponent, FiizRadioComponent
} from './forms';
import { FiizCardComponent } from './card';
import { FiizPillComponent } from './pill';
import { FiizTableComponent } from './table';
import { FiizTabNavComponent } from './tab-nav/tab-nav';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { AutofocusDirective } from '../../directives/autofocus/autofocus.directive';
import { FiizInputCurrencyComponent } from './forms/input-currency';
import { FiizBigButtonComponent } from './big-button';
import { FiizDropDownComponent } from './dropdown';
import { FiizListComponent } from './list/list.component';
import { FiizDataComponent } from './data/data.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../modules/shared/shared.module';
import { FiizButtonComponent } from './button/button';
import { FiizStrokedDirective } from './button/stroked.directive';
import { FiizWarningDirective } from './button/warning.directive';
import { FiizPrimaryDirective } from './button/primary.directive';
import { DpDatePickerModule } from 'ng2-date-picker';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

@NgModule({
  declarations: [
    FiizPillComponent,
    FiizDropDownComponent,
    FiizInputPercentageComponent,
    FiizInputCurrencyComponent,
    FiizCardComponent,
    FiizDatePickerComponent,
    FiizInputComponent,
    FiizRadioComponent,
    FiizTextAreaComponent,
    FiizTableComponent,
    FiizTabNavComponent,
    FiizToggleComponent,
    FiizDatePickerDirective,
    FiizMinDateDirective,
    FiizMaxDateDirective,
    FiizStrokedDirective,
    FiizPrimaryDirective,
    FiizWarningDirective,
    AutofocusDirective,
    ProgressBarComponent,
    FiizButtonComponent,
    FiizBigButtonComponent,
    FiizSelectComponent,
    FiizDropDownComponent,
    FiizListComponent,
    FiizDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SharedModule,
    DpDatePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
    // DirectivesModule
  ],
  exports: [
    // FiizPageHeaderComponent,
    FiizPillComponent,
    FiizInputPercentageComponent,
    FiizInputCurrencyComponent,
    FiizCardComponent,
    FiizDatePickerComponent,
    FiizInputComponent,
    FiizRadioComponent,
    FiizTextAreaComponent,
    FiizTableComponent,
    FiizTabNavComponent,
    FiizToggleComponent,
    FiizDatePickerDirective,
    FiizMinDateDirective,
    FiizMaxDateDirective,
    FiizStrokedDirective,
    FiizPrimaryDirective,
    FiizWarningDirective,
    AutofocusDirective,
    ProgressBarComponent,
    FiizButtonComponent,
    FiizBigButtonComponent,
    FiizSelectComponent,
    FiizDropDownComponent,
    FiizListComponent,
    FiizDataComponent
  ]
})
export class FiizUIModule {
  constructor() {
  }
}
