import { Component, Input } from "@angular/core";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  template: `
    <div @animate>
      <h2>{{data.title}}</h2>
      {{data.body}}
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
export class TextComponent {

  @Input() data: any;

  public save() {

  }
}
