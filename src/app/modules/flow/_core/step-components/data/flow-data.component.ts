import { Component, Input } from '@angular/core';

@Component({
  selector: 'flow-data',
  template: `<fiiz-data [data]="data"></fiiz-data>`,
  styleUrls: ['../_base.scss']
})
export class FlowDataComponent {

  @Input('data') data: any;

  constructor() {

  }
}
