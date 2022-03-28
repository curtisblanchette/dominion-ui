import { Component, Input, OnDestroy } from "@angular/core";
import { FlowTransitions } from "../common";
import { FlowService } from "../flow.service";

@Component({
  template: `
    <div [@slide]="direction">
      <h2>{{data.title}}</h2>
      {{data.body}}
    </div>
  `,
  animations: FlowTransitions,
  styleUrls: ['scss/_base.scss'],
  host: { '[@slide]': 'direction' }
})
export class TextComponent implements OnDestroy {
  direction: string = 'next';
  @Input() data: any;

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
