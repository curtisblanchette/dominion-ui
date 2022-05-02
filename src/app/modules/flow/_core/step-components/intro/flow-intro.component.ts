import { Component, Input, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { FlowService } from "../../../flow.service";

@Component({
  selector: 'flow-intro',
  template: `
    <div>
      <h3>Welcome to Flow!</h3>
    </div>
  `,
  styleUrls: ['../_base.scss']
})
export class FlowIntroComponent implements OnDestroy {

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
