import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[fiizDatePicker]'
})
export class FiizDatePickerDirective {
  private readonly domElement: any;
  private datepickerOptions: any = {
    format: 'MM/DD/YYYY',
    icons: {
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      up: 'fa fa-chevron-up',
      down: 'fa fa-chevron-down',
      previous: 'fa fa-chevron-left',
      next: 'fa fa-chevron-right',
      today: 'fa fa-screenshot',
      clear: 'fa fa-trash',
      close: 'fa fa-remove'
    }
  };

  constructor(private element: ElementRef, private renderer: Renderer2 ) {
    this.domElement = element.nativeElement;
    setTimeout(() => {
      $(this.domElement).attr('autocomplete', 'off');

      if (this.domElement.attributes.format) {
        this.datepickerOptions.format = this.domElement.attributes.format.nodeValue;
      }

      $(this.domElement).datetimepicker(this.datepickerOptions).on('dp.change', () => {
        const inputEvent = new Event('input', {bubbles: true});
        // this.renderer.invokeElementMethod(this.domElement, 'dispatchEvent', [inputEvent]);
        this.domElement.dispatchEvent.apply([inputEvent]);
      });
    });
  }
}

@Directive({
  selector: '[fiizMinDate]'
})
export class FiizMinDateDirective {
  private domElement: any;

  @Input() set fiizMinDate(min: any) {
    setTimeout(() => {
      if (min) {
        $(this.domElement).data('DateTimePicker').minDate(min);
      }
    });
  }

  constructor(private element: ElementRef) {
    this.domElement = element.nativeElement;
  }
}

@Directive({
  selector: '[fiizMaxDate]'
})
export class FiizMaxDateDirective {
  private domElement: any;

  @Input() set fiizMaxDate(max: any) {
    setTimeout(() => {
      if (max) {
        $(this.domElement).data('DateTimePicker').maxDate(max);
      }
    });
  }

  constructor(private element: ElementRef) {
    this.domElement = element.nativeElement;
  }
}
