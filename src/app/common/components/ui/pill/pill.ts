import { Component, Input } from '@angular/core';

export enum PillColorEnum {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow'
}

@Component({
  selector: 'fiiz-pill',
  templateUrl: './pill.html',
  styleUrls: ['./pill.scss']
})
export class FiizPillComponent {

  @Input('title') title: string;
  @Input('color') color: PillColorEnum;

  constructor() {
  }
}
