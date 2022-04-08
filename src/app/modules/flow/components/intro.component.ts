import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div>
      <h3>Welcome to Flow!</h3>
    </div>
  `,
  styleUrls: ['../_core/scss/_base.scss']
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
