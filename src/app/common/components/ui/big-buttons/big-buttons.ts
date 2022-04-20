import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
selector: 'fiiz-big-button',
  templateUrl: './big-buttons.html',
  styleUrls: ['./big-buttons.scss']
})
export class FiizBigButtonComponent {

    @Input('icon') icon!: string;
    @Input('title') title!: string;
    @Input('subtitle') subtitle!: string;
    @Input('theme') theme: string = 'light';

    @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();
  
    constructor() {}

    public emitTheValue( value:string ){
      this.onClick.emit(value);
    }
  
  }