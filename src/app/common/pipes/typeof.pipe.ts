import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeOf'
})
export class TypeOfPipe implements PipeTransform {

    public transform(value: any):string  {
        return value == undefined ? 'string' : typeof value;
    }

}