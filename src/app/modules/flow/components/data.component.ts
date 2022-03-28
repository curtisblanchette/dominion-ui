import { Component, Input, OnDestroy } from "@angular/core";
import { FlowTransitions } from "../common";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div [@slide]="direction">
      <h2>{{data.title}}</h2>
      <label for="firstName">First Name <input type="text" id="firstName" [value]="data.firstName"></label>
      <label for="lastName">Last Name <input type="text" id="lastName" [value]="data.lastName"></label>
      <label for="phone">Phone <input type="text" id="phone" [value]="data.phone"></label>
      <label for="email">Email <input type="text" id="email" [value]="data.email"></label>
    </div>
  `,
  animations: FlowTransitions,
  styleUrls: ['scss/_base.scss'],
  host: { '[@slide]': 'direction' }
})
export class DataComponent implements OnDestroy {
  direction: string = 'next';

  @Input() data: any;
  @Input() module: string;

  constructor(
    private flowService: FlowService
  ) {
    this.direction = localStorage.getItem('direction') || 'next';
  }

  public save() {

  }

  public ngOnDestroy() {
  }
}
