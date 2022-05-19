import { Directive, ElementRef } from '@angular/core';

@Directive({selector: '[warning]'})
export class FiizWarningDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.classList.add('warning');
  }

}
