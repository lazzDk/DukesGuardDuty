// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDrsJFdIJ7-NtdiIVR162nTcFj_s36qU2U",
    authDomain: "dukesguardduty.firebaseapp.com",
    databaseURL: "https://dukesguardduty.firebaseio.com",
    projectId: "dukesguardduty",
    storageBucket: "dukesguardduty.appspot.com",
    messagingSenderId: "231900486009"
  }
};
