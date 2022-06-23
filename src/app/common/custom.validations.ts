import { AbstractControl } from '@angular/forms';
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export function phoneValidation( control:AbstractControl ) {
    try {
        if( control.value && phoneUtil.isValidNumber(phoneUtil.parse(control.value)) ){
            return null;
        }
    } catch( e ){
        return { invalidNumber : true };
    }
}