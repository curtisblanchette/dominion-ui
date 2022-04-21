import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface IDropDownMenuItem {
    label: string;
    icon: string;
    route?: string;
}

@Component({
selector: 'fiiz-dropodown-button',
  templateUrl: './dropdown-button.html',
  styleUrls: ['./dropdown-button.scss']
})
export class DropDownButtonComponent {

    @Input('title') title!: string;
    @Input('items') items:IDropDownMenuItem[];

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
