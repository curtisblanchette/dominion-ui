import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'fiiz-progress-bar',
  templateUrl: './progress-bar.component.html',
  // styleUrls: ['./progress-bar.component.scss']
})

export class ProgressBarComponent implements AfterViewInit {

  @Input('value') value!: number;
  @Input('goal') goal!: number;
  @Input('min') min!: number;
  @Input('label') label!: string;
  @Input('showMarkers') showMarkers = true;
  @Input('percentage') percentage = false;
  @Input('height') height = 10;
  @Input('isLoading') isLoading = true;
  @ViewChild('minMarker') minMarker!: ElementRef;
  @ViewChild('goalMarker') goalMarker!: ElementRef;
  @ViewChild('container') container!: ElementRef;

  @Output('onWarning') onWarning: EventEmitter<any> = new EventEmitter();


  public minMarkerX = '0';
  public goalMarkerX = '0';
  public goalMarkerWidth!: number;
  public percentageValue = 0;


  constructor(

  ) {

  }

  get fillColor() {
    return this.value >= this.min ? 'linear-gradient(180deg, #00B2FF 0%, #0072A4 100%)' : 'linear-gradient(180deg, #D84444 0%, #9B2525 100%)';
  }

  get fillPercentage() {
    let percentage = this.value / this.goal * 100;

    if (percentage > 100) {
      percentage = 100;
    }

    return percentage + '%';
  }

  get _value(): number | string {
    if (this.percentage) {
      if (this.value) {
        return parseInt((this.value / this.goal * 100).toFixed(), 0) + '%';
      } else {
        return 0;
      }
    } else {
      return this.value;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.minMarker) {
        this.minMarker.nativeElement.style.transform = `translateX(-${this.minMarker.nativeElement.clientWidth}px)`;
        this.minMarkerX = this.min / this.goal * 100 + '%';
      }

      if (this.goalMarker) {
        this.goalMarkerWidth = this.goalMarker.nativeElement.clientWidth;
        this.goalMarker.nativeElement.style.transform = `translateX(-${this.goalMarker.nativeElement.clientWidth + 2}px)`;
        this.goalMarkerX = this.goal / this.goal * 100 + '%';
      }

      if (this.showMarkers) {
        const containerHeight = this.container.nativeElement.clientHeight;
        const clientHeight = this.minMarker.nativeElement.clientHeight;
        this.container.nativeElement.style.height =  containerHeight +  clientHeight + 'px';
      }



      if (this.value < this.goal ) {
        this.onWarning.next({ label: this.label, min: this.min, goal: this.goal, value: this.value });
      }
    });
  }


}
