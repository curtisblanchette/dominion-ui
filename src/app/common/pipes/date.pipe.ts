import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import dayjs from 'dayjs';
import { ISetting } from '../../store/app.effects';

@Pipe({
  name: 'fiizDate'
})
@Injectable({
  providedIn: 'root'
})
export class FiizDatePipe implements PipeTransform {

  public tz: string = 'America/New_York';

  constructor(
    public store: Store<fromApp.AppState>
  ) {

    this.store.select(fromApp.selectSettingByKey('timezone')).subscribe((timezone: ISetting | undefined) => {
      this.tz = timezone?.value;
    });
  }

  public transform(value: any, format: string, timezone: string): string  {
    return dayjs(value).tz(this.tz).format(format);
  }

}
