import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);
import { validate as isUuid } from "uuid";

@Pipe({
    name: 'typeOf'
})
export class TypeOfPipe implements PipeTransform {

    public transform(value: any): string  {
      /** can we determine what the relationship is type */
      if( Array.isArray(value) && value.length > 0 ) {
        if(value[0].hasOwnProperty('line1')) {
          return 'address';
        }
      }

      if( Array.isArray(value) ) {
        return 'array';
      }
      if(isUuid(value)) {
        return 'uuid';
      }
      if(dayjs(value, 'YYYY-MM-DDTHH:MM:SS.Z').isValid()) {
        return 'date';
      }
      return value == undefined ? 'string' : typeof value;
    }

}
