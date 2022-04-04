import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div>
      <h2>{{data.title}}</h2>
      <label for="firstName">First Name <input type="text" id="firstName" [value]="data.firstName"></label>
      <label for="lastName">Last Name <input type="text" id="lastName" [value]="data.lastName"></label>
      <label for="phone">Phone <input type="text" id="phone" [value]="data.phone"></label>
      <label for="email">Email <input type="text" id="email" [value]="data.email"></label>
    </div>
  `,
  styleUrls: ['scss/_base.scss']
})
export class DataComponent implements OnDestroy {

  public data: any;
  @Input() module: string;

  constructor(
    private flowService: FlowService,
    private router: Router
  ) {
    this.data = this.router.getCurrentNavigation()!.extras.state;
  }

  public save() {

  }

  public ngOnDestroy() {
  }
}
