import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingComponent } from '../../common/components/ui/loading/loading.component';
import { SafePipe } from '../../common/pipes/safe.pipe';
import { TypeOfPipe } from '../../common/pipes/typeof.pipe';
import { FormsModule } from '@angular/forms';
import { FiizDatePipe } from '../../common/pipes/date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    LoadingComponent,
    SafePipe,
    TypeOfPipe,
    FiizDatePipe
  ],
  exports: [
    CommonModule,
    LoadingComponent,
    SafePipe,
    TypeOfPipe,
    FiizDatePipe
  ]
})
export class SharedModule {

}

