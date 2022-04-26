import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DropDownButtonAnimation } from './dropdown.animations';

export interface IDropDownMenuItem {
  label: string;
  icon: string;
  route?: string;
  emitterValue?: any;
}

@Component({
  selector: 'fiiz-dropodown-button',
  templateUrl: './dropdown-button.html',
  styleUrls: ['./dropdown-button.scss'],
  animations : [ DropDownButtonAnimation ]
})
export class DropDownButtonComponent {

    @Input('title') title!: string;
    @Input('items') items:IDropDownMenuItem[];
    @Input('position') position: 'top-right';

    @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();

    public showDropDowns:boolean = false;

    constructor() {}

    public emitTheValue( value:string ){
      this.onClick.emit(value);
    }

    public toggle(){
      this.showDropDowns = !this.showDropDowns;
    }

  }
