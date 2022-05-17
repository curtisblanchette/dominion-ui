import { Component, Input } from '@angular/core';

export type LoadingType = 'ring' | 'dual-ring' | 'ripple' | 'branded';

@Component({
  selector: 'fiiz-loading',
  templateUrl: './loading.component.html',
  styleUrls: [
    './ring.scss',
    './dual-ring.scss',
    './ripple.scss',
    './loading.component.scss'
  ]
})
export class LoadingComponent {

  @Input('type') type: LoadingType = 'ripple'
  @Input('hasError') hasError: boolean | undefined;
  @Input('errorHTML') errorHTML: string | undefined;

  constructor() { }


}
