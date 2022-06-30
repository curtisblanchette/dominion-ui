import { cloneDeep } from 'lodash';

export type OmitMethods =  'apply' | '_serialize' | '_deserialize';

export class User {
  access_token: string;
  id_token: string;
  refresh_token: string;
  roles: string;
  username: string;
  picture: string;
  id?: string;
  email?: string;
  workspace?: string;
  language?: string;
  timezone?: string;
  calendarType?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;

  constructor(
    data: Omit<User, OmitMethods>
  ) {
    this.apply(data);
  }

  public apply(data:  Omit<User, OmitMethods>): void {
     Object.assign(this, data);
  }

  public _serialize(): string {
    return JSON.parse(JSON.stringify(this));
  }

  public _deserialize(): User {
    const data: User = {...cloneDeep(this)};
    return new User(data);
  }
}
