import { Component, OnDestroy } from "@angular/core";
import { FlowService } from "../flow.service";
import { Router } from "@angular/router";

@Component({
  template: `
    <div>
      <h2>{{data.title}}</h2>
      {{data.body}}
    </div>
  `,
    styleUrls: ['scss/_base.scss'],
})
export class TextComponent implements OnDestroy {
  direction: string = 'next';
  public data: any;

  constructor(
    private router: Router,
    private flowService: FlowService
  ) {
    this.data = this.router.getCurrentNavigation()!.extras.state;
  }
  public save() {

  }

  public ngOnDestroy() {
  }
}
