import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({selector: '[cols]'})
export class FiizGridColsDirective {
  @Input() set cols(count: number) {

    if(count) {
      this.el.nativeElement.style['grid-template-columns'] = `repeat(${count}, 1fr)`;
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {

  }
}



