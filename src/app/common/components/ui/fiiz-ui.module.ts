import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FiizInputPercentageComponent,
  FiizSelectComponent,
  FiizDatePickerComponent,
  FiizDatePickerDirective,
  FiizMaxDateDirective,
  FiizMinDateDirective, FiizInputComponent, FiizTextAreaComponent
} from './forms';
import { FiizCardComponent } from './card';
import { FiizPillComponent } from './pill';
import { FiizTableComponent } from './table';
import { FiizTabNavComponent } from './tab-nav/tab-nav';
import { RouterModule } from '@angular/router';
import { FiizToggleComponent } from './forms/toggle/toggle';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { AutofocusDirective } from '../../directives/autofocus/autofocus.directive';
import { FiizInputCurrencyComponent } from './forms/input-currency';
import { FiizBigButtonComponent } from './big-button';
import { FiizDropDownComponent } from './dropdown';
import { FiizListComponent } from './list/list.component';
import { FiizDataComponent } from './data/data.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    FiizPillComponent,
    FiizDropDownComponent,
    FiizInputPercentageComponent,
    FiizInputCurrencyComponent,
    FiizCardComponent,
    FiizDatePickerComponent,
    FiizInputComponent,
    FiizTextAreaComponent,
    FiizTableComponent,
    FiizTabNavComponent,
    FiizToggleComponent,
    FiizDatePickerDirective,
    FiizMinDateDirective,
    FiizMaxDateDirective,
    AutofocusDirective,
    ProgressBarComponent,
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
    ReactiveFormsModule
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
    FiizTextAreaComponent,
    FiizTableComponent,
    FiizTabNavComponent,
    FiizToggleComponent,
    FiizDatePickerDirective,
    FiizMinDateDirective,
    FiizMaxDateDirective,
    AutofocusDirective,
    ProgressBarComponent,
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
