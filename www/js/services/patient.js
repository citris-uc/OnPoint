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
      return $window.localStorage.getItem("uid")
    },
    setUID: function(uid) {
      return $window.localStorage.setItem("uid", uid)
    },
    get: function() {
      patient = $window.localStorage.getItem("patient")
      if (patient)
        return JSON.parse(patient)
      else
        return {}
    },
    getFromFirebase: function() {
      var ref = new Firebase(onpoint.env.mainURL + "patients/");
      var uid = this.uid();
      return ref.child(uid).child("patient").once("value")
    },
    set: function(patient) {
      if (patient)
        $window.localStorage.setItem("patient", JSON.stringify(patient));
      else
        $window.localStorage.setItem("patient", null)
    },
    create: function(patient) {
      thisPatient = this
      var ref = new Firebase(onpoint.env.mainURL + "patients/");
      var uid = this.uid();
      return ref.child(uid).child("patient").set(patient).then(function(response) {
        thisPatient.set(patient)
      })
    },

    setAttribute: function(attr, value) {
      patient = this.get()
      patient[attr] = value
      this.set(patient)
    },
    setToken: function(token) {
      if (token == null)
        $window.localStorage.setItem("token", "");
      else
        $window.localStorage.setItem("token", token);
    },
    getToken: function() {
      return $window.localStorage.getItem("token");
    },
    ref: function() {
      var patientRef = new Firebase(onpoint.env.mainURL + "patients/");
      var uid = this.uid();
      // TODO: Remove the ref for all patients... Otherwise, we end up adding stuff
      // to the /patients/ resource when it should be for /patients/:uid resource.
      if (uid) {
        return patientRef.child(uid);
      } else
        return patientRef;
    },
    auth: function() {
      return $firebaseAuth(this.ref());
    },
    logout: function() {
      thisPatient = this
      thisPatient.setToken("")
      thisPatient.setUID("")
      return this.auth().$unauth()
    }
  };
})
