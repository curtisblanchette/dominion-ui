import { Directive, ElementRef } from '@angular/core';

@Directive({selector: '[primary]'})
export class FiizPrimaryDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('primary');
  }

}
