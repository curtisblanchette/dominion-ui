import { Component, Input } from '@angular/core';

export interface IFiizTabNavItems {
  routerLink: string;
  label: string;
}

@Component({
  selector: 'fiiz-tabnav',
  templateUrl: './tab-nav.html',
  styleUrls: ['./tab-nav.scss']
})
export class FiizTabNavComponent {

  @Input('navItems') navItems: IFiizTabNavItems[];

  constructor() {

  }

}
