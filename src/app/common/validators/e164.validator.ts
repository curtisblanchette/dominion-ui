import { AbstractControl, Validator } from '@angular/forms';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export class e164 implements Validator {
  validate(control: AbstractControl): {[key: string]: boolean} | null {
    if(control.value) {
      try {
        const parsed = phoneUtil.parse(control.value);
        if(control.value && parsed && !phoneUtil.isValidNumber(parsed)) {
          return { invalidNumber : true };
        }
      } catch(e) {
        return { invalidNumber: true };
      }

    }


    return null;
  }
}
