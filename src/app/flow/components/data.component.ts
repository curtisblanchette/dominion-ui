import { Component, Input } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  template: `
    <div @animate>
      <h2>{{data.title}}</h2>
      <label for="firstName">First Name <input type="text" id="firstName" [value]="data.firstName"></label>
      <label for="lastName">Last Name <input type="text" id="lastName" [value]="data.lastName"></label>
      <label for="phone">Phone <input type="text" id="phone" [value]="data.phone"></label>
      <label for="email">Email <input type="text" id="email" [value]="data.email"></label>
    </div>
  `,
  animations: [
    trigger('animate', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.25s ease-in-out', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        animate('.25s ease-in-out', style({ opacity: '0' }))
      ])
    ])
  ]
})
export class DataComponent {
  @Input() data: any;

  public save() {

  }
}
