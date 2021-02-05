import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
var firebaseui = require("firebaseui");

export function firebaseInit() {
  const firebaseConfig = {
    apiKey: "AIzaSyCUAYYXiX31INiNwHIEeeSWzVAwal85I7A",
    authDomain: "deltasudoku.firebaseapp.com",
    projectId: "deltasudoku",
    storageBucket: "deltasudoku.appspot.com",
    messagingSenderId: "320854572410",
    appId: "1:320854572410:web:537e5c2bd72a861f006ac3",
    measurementId: "G-BPQC8FCQ0L",
  };
  //console.log(firebase);
  !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();
}
export function firebaseUI() {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById("loader").style.display = "none";
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "/settings",
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //   firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };
  const ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());
  ui.start("#firebaseui-auth-container", uiConfig);
}

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location = "/";
    });
}
