import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingComponent } from '../../common/components/ui/loading/loading.component';
import { SafePipe } from '../../common/pipes/safe.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LoadingComponent,
    SafePipe
  ],
  exports: [
    CommonModule,
    LoadingComponent,
    SafePipe
  ]
})
export class SharedModule {

}

