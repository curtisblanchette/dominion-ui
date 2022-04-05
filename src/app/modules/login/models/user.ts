export class User {
    access_token: string;
    refresh_token: string;
    id_token: string;
    role: string;
    username: string;
    picture: string;
    id?: string;
    email?: string;
    name?: string;
    workspace?: string;
    language?: string;
    timezone?: string;
    calendarType?: string;

    constructor(
      picture: string,
      access_token: string,
      refresh_token: string,
      id_token: string,
      role: string,
      username: string,
      id?: string,
      language?: string,
      timezone?: string,
      email?: string,
      name?: string,
      workspace?: string,
      calendarType?: string
    ) {
      this.id = id;
      this.picture = picture;
      this.access_token = access_token;
      this.refresh_token = refresh_token;
      this.id_token = id_token;
      this.role = role;
      this.username = username;
      this.workspace = workspace;
      this.language = language;
      this.timezone = timezone;
      this.email = email;
      this.name = name;
      this.calendarType = calendarType;
    }
}
