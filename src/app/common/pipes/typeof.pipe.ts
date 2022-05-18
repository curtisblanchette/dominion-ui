import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);
import { validate } from "uuid";

@Pipe({
    name: 'typeOf'
})
export class TypeOfPipe implements PipeTransform {

    public transform(value: any): string  {
      if(validate(value)) {
        return 'uuid';
      }
      if(dayjs(value, 'YYYY-MM-DDTHH:MM:SS.Z').isValid()) {
        return 'date';
      }
      return value == undefined ? 'string' : typeof value;
    }

}
