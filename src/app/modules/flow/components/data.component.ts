import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div>
      <h3>{{data.title}}</h3>
      <fiiz-input type="text" id="firstName" placeholder="First Name" [ngModel]="data.firstName"></fiiz-input>
      <fiiz-input type="text" id="lastName" placeholder="Last Name" [ngModel]="data.lastName"></fiiz-input>
      <fiiz-input type="text" id="phone" placeholder="Mobile" [ngModel]="data.phone"></fiiz-input>
      <fiiz-input type="text" id="email" placeholder="Email" [ngModel]="data.email"></fiiz-input>
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
