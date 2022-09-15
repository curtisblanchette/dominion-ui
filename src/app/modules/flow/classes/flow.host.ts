import { AfterContentInit, Directive, ViewContainerRef } from '@angular/core';
import { FlowService } from '../flow.service';

@Directive({
  selector: '[flowHost]',
})
export class FlowHostDirective implements AfterContentInit {
  constructor(
    public viewContainerRef: ViewContainerRef,
    public flowService: FlowService
  ) {

  }

  ngAfterContentInit() {
      this.flowService['flowHost'] = { viewContainerRef: this.viewContainerRef };
  }
}
