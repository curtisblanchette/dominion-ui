import { Component } from '@angular/core';

@Component({
  selector: 'flow-list',
  template: `
    <p class="dictation">Thank you for calling the Law Offices of Diener Law, this is Miguel, how may I assist you today?</p>
    <fiiz-list></fiiz-list>
  `,
  styleUrls: ['../_base.scss']
})
export class FlowListComponent {
  constructor() {

  }
}
