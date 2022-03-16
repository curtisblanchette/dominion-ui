import { Component, EventEmitter, Input, Output } from '@angular/core';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  @Input('canTryAgain') canTryAgain = false;
  @Input('hasError') hasError: boolean | undefined;
  @Input('errorHTML') errorHTML: string | undefined;
  @Output('tryAgainFn') tryAgainFn: EventEmitter<any> = new EventEmitter();

  constructor() { }

  tryAgain() {
    this.tryAgainFn.emit();
  }

  get supportUrl() {
    return environment.support_url;
  }

}
