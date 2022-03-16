import { Component, Input } from '@angular/core';

@Component({
  selector: 'fiiz-card',
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class FiizCardComponent {

  @Input('title') title!: string;
  @Input('icon') _icon!: string;
  @Input('darkHeader') darkHeader = false;

  constructor() {
  }

  get icon() {
    return this._icon ? `fa-${this._icon}` : '';
  }
}
