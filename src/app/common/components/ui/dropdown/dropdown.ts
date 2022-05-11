import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { DropDownAnimation } from './dropdown.animations';
import { DropdownItem } from '../../interfaces/dropdownitem.interface';


export interface IDropDownMenu extends DropdownItem {

}

export interface IDropDownMenu {
  type:string;
  title?:string;
  items: IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[];
  position?:string;
}

export interface IDropDownMenuItemAnchor {
  label:string;
  icon?: string;
  path: string;
}

export interface IDropDownMenuItem {
  label:string;
  icon: string;
  emitterValue:string;
}

@Component({
  selector: 'fiiz-dropdown',
  templateUrl: './dropdown.html',
  styleUrls: ['./dropdown.scss'],
  animations : [ DropDownAnimation ]
})
export class FiizDropDownComponent implements OnInit {

    @Input('items') items:IDropDownMenuItemAnchor[] | IDropDownMenuItem[] | DropdownItem[];
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