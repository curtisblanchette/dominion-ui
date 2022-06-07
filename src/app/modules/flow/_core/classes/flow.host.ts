import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[flowHost]',
})
export class FlowHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
