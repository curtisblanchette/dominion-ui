import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[flowHost]',
})
export class FlowDirective {
  constructor(
    public viewContainerRef: ViewContainerRef
  ) {

  }
}
