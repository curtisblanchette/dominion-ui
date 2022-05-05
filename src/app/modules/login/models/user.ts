export class User {
  access_token: string;
  id_token: string;
  refresh_token: string;
  role: string;
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

  constructor(
    data: Omit<User, 'fullName' | 'apply'>
  ) {
    this.apply(data);
  }

  public apply(data:  Omit<User,'fullName' | 'apply'>): void {
     Object.assign(this, data);
  }

  get fullName(): string {
    if(this.role.includes('system')){
      return 'System Administrator';
    }
    return (this.firstName || '') + ' ' + (this.lastName || '');
  }

}
