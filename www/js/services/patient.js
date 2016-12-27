/*
This factory abstracts the interaction with the persistence layer to
fetch the Patient object. The Patient object is *mostly* Firebase data that
is returned via password authentication:

https://www.firebase.com/docs/web/guide/login/password.html
*/
angular.module('app.services')
.factory('Patient', function($window, $firebaseAuth, $firebaseObject) {
  return {
    uid: function() {
      return this.get().uid;
    },
    get: function() {
      return JSON.parse($window.localStorage.getItem("patient") || "{}");
    },
    set: function(patient) {
      this.setToken(patient.token);
      $window.localStorage.setItem("patient", JSON.stringify(patient || {}));
    },
    // DEPRECIATED: because moving to register screen
    // create: function(email, authData) {
    //   // Create the patient, add to localstorage, and add the token.
    //   patient = {email: email, uid: authData.uid, profileImageUrl: authData.profileImageUrl}
    //   //this.set(patient) //authData will only contain UID
    //   this.ref(authData.uid).set({email: email})
    //   //this.setToken(authData.token) //authData will only contain UID
    // },
    getProfile: function() {
      ref = this.ref().child('profile')
      return $firebaseObject(ref)
    },
    setProfilePicture: function(profileImageUrl) {
      patient = this.get();
      patient.profileImageUrl = profileImageUrl;
      this.set(patient)
    },
    setToken: function(token) {
      if (token == null)
        $window.localStorage.removeItem("token");
      else
        $window.localStorage.setItem("token", token);
    },
    getToken: function() {
      return $window.localStorage.getItem("token");
    },
    ref: function() {
      var patientRef = new Firebase(onpoint.mainURL + "patients/");
      var uid = this.uid();
      if (uid)
        return patientRef.child(uid);
      else
        return patientRef;
    },
    auth: function() {
      return $firebaseAuth(this.ref());
    },
    logout: function() {
      this.auth().$unauth();
      this.setToken(null);
    }
  };
})
