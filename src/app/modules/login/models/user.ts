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
    data: Omit<User, 'apply'>
  ) {
    this.apply(data);
  }

  public apply(data:  Omit<User, 'apply'>): void {
     Object.assign(this, data);
  }

}
