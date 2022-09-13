import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
export type ButtonSizes = 'x-small' | 'small' | 'large';

@Directive({
  selector: '[size]'
})
export class FiizButtonSizeDirective implements OnInit {
  private _size: ButtonSizes;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
  }

  ngOnInit() {
    if (this._size || typeof this._size === 'undefined') {
      this.renderer.addClass(this.el.nativeElement, this._size);
    }
  }

  @Input() set size(size: ButtonSizes) {
    this._size = size;
  }
}
