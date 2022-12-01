import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  ICognitoUserData,
  ICognitoUserPoolData,
  CognitoUserSession,
  ICognitoUserSessionData,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  readonly cognitoUserPool!: CognitoUserPool;
  readonly cognitoUserPoolData!: ICognitoUserPoolData;
  private cognitoUserData!: ICognitoUserData;
  private cognitoUser!: CognitoUser;
  public cognitoUserSession!: CognitoUserSession;

  constructor() {

    this.cognitoUserPoolData = {
      UserPoolId: <any>environment.cognito_userPoolId,
      ClientId: <any>environment.cognito_clientId
    };

    this.cognitoUserPool = new CognitoUserPool(this.cognitoUserPoolData);

    const existingSession = this.getExistingSession() as { session: ICognitoUserSessionData, username: string };

    if (existingSession) {
      this.cognitoUserData = {
        Username: existingSession.username,
        Pool: this.cognitoUserPool
      };
      this.cognitoUser = new CognitoUser(this.cognitoUserData);
      this.cognitoUserSession = new CognitoUserSession(existingSession.session);
      this.cognitoUser.setSignInUserSession(this.cognitoUserSession);
    } else {
      // you aren't logged in
    }

  }

  private getExistingSession(): {session: ICognitoUserSessionData, username: string} | boolean {
    const username = localStorage.getItem(
      `CognitoIdentityServiceProvider.${this.cognitoUserPoolData.ClientId}.LastAuthUser`
    );

    if (username) {
      return {
        session: {
          IdToken: new CognitoIdToken({
            IdToken: localStorage.getItem(
              `CognitoIdentityServiceProvider.${this.cognitoUserPoolData.ClientId}.${username}.idToken`
            ) || ''
          }),
          AccessToken: new CognitoAccessToken({
            AccessToken: localStorage.getItem(
              `CognitoIdentityServiceProvider.${this.cognitoUserPoolData.ClientId}.${username}.accessToken`
            ) || ''
          }),
          RefreshToken: new CognitoRefreshToken({
            RefreshToken: localStorage.getItem(
              `CognitoIdentityServiceProvider.${this.cognitoUserPoolData.ClientId}.${username}.refreshToken`
            ) || ''
          })
        },
        username: username
      };
    }
    return false;
  }

  public authenticateUser(authenticationData: { Username: any; }): Promise<CognitoUserSession | { mfaRequired: boolean, challengeParameters: any }> {

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    this.cognitoUserData = {
      Username: authenticationData.Username,
      Pool: this.cognitoUserPool
    };

    this.cognitoUser = new CognitoUser(this.cognitoUserData);

    return new Promise((resolve, reject) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session: CognitoUserSession) => {
          this.cognitoUserSession = session;
          this.cognitoUser.setSignInUserSession(this.cognitoUserSession);
          resolve(this.cognitoUserSession);
        },
        onFailure: (err) => {
          reject(err);
        },
        mfaRequired: (codeDeliveryDetails, challengeParameters) => {
          resolve({mfaRequired: true, challengeParameters});
        }
      });
    });
  }

  public sendMFACode(mfaCode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.cognitoUser.sendMFACode(mfaCode, {
        onSuccess: (res) => {
          resolve(res);
        },
        onFailure: (err) => {
          reject(err);
        }
      });
    });
  }

  public refreshSession(): Promise<any> {
    return new Promise((resolve, reject) => {
      const userSession = this.cognitoUser.getSignInUserSession();
      if( userSession ){
        return this.cognitoUser.refreshSession(userSession.getRefreshToken(), (error, session) => {
          if (error) {
            return reject(error);
          }
          return resolve(session);
        });
      }
    }) as Promise<any>;
  }



}
