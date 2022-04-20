import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  FiizInputPercentageComponent,
  FiizDropdownComponent,
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
import { FiizBigButtonComponent } from './big-button/index';

@NgModule({
  declarations: [
    FiizPillComponent,
    FiizDropdownComponent,
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
    FiizBigButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    // DirectivesModule
  ],
  exports: [
    // FiizPageHeaderComponent,
    FiizPillComponent,
    FiizDropdownComponent,
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
    FiizBigButtonComponent
  ]
})
export class FiizUIModule {
  constructor() {
  }
}
