import { Component, Input } from "@angular/core";
import { FlowAnimations } from "../common";

@Component({
  template: `
    <div [@slide]="direction">
      <h2>{{data.title}}</h2>
      {{data.body}}
    </div>
  `,
  animations: FlowAnimations,
  styleUrls: ['_base.scss'],
  host: { '[@slide]': 'direction' }
})
export class TextComponent {
  direction: string = 'next';
  @Input() data: any;

  public save() {

  }
}
