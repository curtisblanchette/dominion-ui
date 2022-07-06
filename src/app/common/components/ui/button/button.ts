import { Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'fiiz-button',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiizButtonComponent implements AfterViewInit, AfterViewInit {

  @Input('icon') icon!: string;
  @Input('type') type: 'button' | 'submit' = 'button';
  @Input('theme') theme: string = 'light';
  @Input('disabled') isDisabled: boolean;
  @Input('class') class: string = '';
  @Input('loading') loading$: Observable<boolean> = of(false);

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
