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

  }

  @Input() set autofocus(condition: boolean) {
    this._autofocus = condition;
  }
}

@Directive({
  selector: '[fiizfocus]'
})
export class FiizFocusDirective implements OnInit {
  private _autofocus:any;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    if (this.el.nativeElement.autofocus) {
      this.el.nativeElement.focus();
    }

  }

  @Input() set autofocus(condition: boolean) {
    this._autofocus = condition;
  }
}
