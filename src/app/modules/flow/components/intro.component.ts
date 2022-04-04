import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div>
      <h2>Welcome to Flow!</h2>
    </div>
  `,
  styleUrls: ['scss/_base.scss']
})
export class IntroComponent implements OnDestroy {

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
