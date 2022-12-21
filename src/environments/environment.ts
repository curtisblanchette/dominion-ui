// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dominion_api_url: 'http://localhost:3000/api/v1',
  support_url: 'mailto: hello@curtisblanchette.com',
  cognito_userPoolId : 'us-west-2_EXLxFUeRZ',
  cognito_clientId : '6k4k9c29p3lu536i5smgl3cp3l',
  opp_follow_up_min_score: 60
  // acting_for: '01772871-f877-4ee2-930a-39f768cdc11e'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
