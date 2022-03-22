import { IContact } from "@4iiz/corev2";
import * as _ from 'lodash';

export class ContactModel implements IContact {
  public id: string;
  public firstName: string;
  public lastName: string;
  public phone: string;
  public email: string;
  public leadId: string;

  constructor(data: IContact) {
    _.merge(this, data);
  }

  public save() {
    // make api call to our backend using a service
  }

}
