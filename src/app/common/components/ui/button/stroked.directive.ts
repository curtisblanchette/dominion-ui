import { Directive, ElementRef } from '@angular/core';

@Directive({selector: '[stroked]'})
export class FiizStrokedDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('stroked');
  }

}
