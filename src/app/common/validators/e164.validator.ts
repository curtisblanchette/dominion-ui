import { AbstractControl, Validator } from '@angular/forms';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export class e164 implements Validator {
  validate(control: AbstractControl): {[key: string]: boolean} | null {
    if(control.value && !phoneUtil.isValidNumber(phoneUtil.parse(control.value))) {
      return { invalidNumber : true };
    }
    return null;
  }
}
