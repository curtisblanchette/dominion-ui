import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { DropDownButtonAnimation } from './dropdown.animations';

export interface IDropDownMenu {
  type:string;
  title?:string;
  items: IDropDownMenuItemAnchor | IDropDownMenuItemButton;
  position?:string;
};

export interface IDropDownMenuItemAnchor {
  label:string;
  icon?: string;
  path: string;
}

export interface IDropDownMenuItemButton {
  label:string;
  icon: string;
  emitterValue:string;
}

@Component({
  selector: 'fiiz-dropodown-button',
  templateUrl: './dropdown-button.html',
  styleUrls: ['./dropdown-button.scss'],
  animations : [ DropDownButtonAnimation ]
})
export class DropDownButtonComponent implements OnInit {

    @Input('items') items:IDropDownMenuItemAnchor[] | IDropDownMenuItemButton[];
    @Input('position') position:string = 'top-right';
    @Input('title') title!:string;
    @Input('type') type!:string;

    @Output('onClick') onClick: EventEmitter<any> = new EventEmitter();

    @HostListener('click', ['$event'])
    clickInside($event: Event) {
      $event.stopPropagation();
      this.toggle();
    }

    @HostListener('document:click')
    clickOutside() {
      this.showDropDowns = false;
    }

    public showDropDowns:boolean = false;
    public selected!: any;

    constructor() {}

    public ngOnInit(): void {

    }

    public emitTheValue( value:string ){
      this.onClick.emit(value);
    }

    public toggle() {
      this.showDropDowns = !this.showDropDowns;
    }

  }
