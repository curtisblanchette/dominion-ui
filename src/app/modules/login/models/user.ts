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
    picture: string,
    access_token: string,
    id_token: string,
    refresh_token: string,
    role: string,
    username: string,
    id?: string,
    language?: string,
    timezone?: string,
    email?: string,
    workspace?: string,
    calendarType?: string,
    firstName?: string,
    lastName?: string
  ) {
    this.id = id;
    this.picture = picture;
    this.access_token = access_token;
    this.id_token = id_token;
    this.refresh_token = refresh_token;
    this.role = role;
    this.username = username;
    this.workspace = workspace;
    this.language = language;
    this.timezone = timezone;
    this.email = email;
    this.calendarType = calendarType;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
  }

  get fullName(): string {
    if(this.role.includes('system')){
      return 'System Administrator';
    }
    return this.firstName + ' ' + this.lastName;
  }

}
