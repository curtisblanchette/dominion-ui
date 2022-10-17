import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromLogin from '../../modules/login/store/login.reducer';
import * as fromFlow from '../../modules/flow/store/flow.reducer';
import { ISetting } from '../../store/app.effects';

@Pipe({
  name: 'dictate'
})
@Injectable({
  providedIn: 'root'
})
export class DictationPipe implements PipeTransform {

  public replacements: {[key: string]: any} = {}

  constructor(
    public store: Store<fromApp.AppState>,
  ) {

    this.store.select(fromApp.selectSettings).subscribe((settings: any) => {
      this.replacements['company'] = settings?.find((s: ISetting) => s.name === 'company_name')?.value;
    });
    this.store.select(fromLogin.selectUser).subscribe((user: any) => {
      this.replacements['username'] = user?.firstName;
    });
    this.store.select(fromFlow.selectAllVariables).subscribe((vars: any) => {
      this.replacements['contact_name'] = vars['contact_name'];
    });

  }

  public transform(value: any): string  {

    for(let key in this.replacements) {
      const replace = "\\{" + key + "\\}";
      const regex = new RegExp(replace, 'g')
      value = value.replace(regex, this.replacements[key]);
    }

    return value;
  }

}
