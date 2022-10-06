import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'includes'
})
export class IncludesPipe implements PipeTransform {
  transform(array: Array<string|number>, value:string|number): boolean {
    return array.includes(value);
  }
}
