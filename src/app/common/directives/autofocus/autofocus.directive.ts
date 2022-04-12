import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {
  private _autofocus:any;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    if (this._autofocus || typeof this._autofocus === 'undefined') {
      this.el.nativeElement.focus();
    }
    // For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
  }

  @Input() set autofocus(condition: boolean) {
    this._autofocus = condition !== false;
  }
}
