import { Component, Input } from "@angular/core";
import { FlowAnimations } from "../common";

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
  animations: FlowAnimations,
  styleUrls: ['_base.scss'],
  host: { '[@slide]': 'direction' }
})
export class DataComponent {
  direction: string = 'next';
  @Input() data: any;

  public save() {

  }
}
