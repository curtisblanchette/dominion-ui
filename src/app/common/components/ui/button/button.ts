import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'fiiz-button',
  templateUrl: './button.html',
  styleUrls: ['./button.scss']
})
export class FiizButtonComponent implements AfterViewInit {

  @Input('icon') icon!: string;
  @Input('type') type: 'button' | 'submit' = 'button';
  @Input('theme') theme: string = 'light';
  @Input('disabled') isDisabled: boolean;
  @Input('class') class: string = '';
  @Input('loading') loading: boolean = false;

  @ViewChild('el') el: ElementRef;

  constructor(
  ) {
  }

  public ngAfterViewInit() {
    this.class.split(' ').forEach(className => {
      if (className) {
        this.el.nativeElement.classList.add(className);
      }
    });
  }

}
