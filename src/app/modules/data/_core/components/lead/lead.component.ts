import { Component, OnInit } from '@angular/core';

import { IDropDownMenuItem } from '../../../../../common/components/ui/dropdown/dropdown';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  public menuItems: IDropDownMenuItem[] = [
    {
      label: 'Delete',
      icon: 'fa-solid fa-trash',
      emitterValue : 'object'
    },
    {
      label: 'Soemthing',
      icon: 'fa-brands fa-500px',
      emitterValue : 'so-something'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  public getValue( value:any ){
    console.log('Emitterd', value);
  }

}
