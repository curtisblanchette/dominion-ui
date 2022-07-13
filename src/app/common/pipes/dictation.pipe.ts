import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);
import { validate as isUuid } from "uuid";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as fromLogin from '../../modules/login/store/login.reducer';
import { ISettingResponse, IUser } from '@4iiz/corev2';

@Pipe({
  name: 'dictate'
})
@Injectable({
  providedIn: 'root'
})
export class DictationPipe implements PipeTransform {

  public replacements: {[key: string]: string} = {}

  constructor(
    public store: Store<fromApp.AppState>
  ) {

    this.store.select(fromApp.selectSettings).subscribe((settings: any) => {
      this.replacements['company'] = settings?.general?.company_name?.value;
    });
    this.store.select(fromLogin.selectUser).subscribe((user: any) => {
      this.replacements['username'] = user?.firstName;
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
