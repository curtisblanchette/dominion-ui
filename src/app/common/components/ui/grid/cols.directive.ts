import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({selector: '[cols]'})
export class FiizGridColsDirective {
  @Input() set cols(count: number) {
    this.el.nativeElement.style['grid-template-columns'] = `repeat(${count}, 1fr)`;
    const headings = [...this.el.nativeElement.children].slice(0, count);
    for(let heading of headings) {
      this.renderer.setStyle(heading, 'line-height', '36px');
      this.renderer.setStyle(heading, 'color', 'var(--green1)');
    }
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {

  }

}
