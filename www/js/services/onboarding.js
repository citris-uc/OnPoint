/*
This factory abstracts the interaction with the persistence layer to
fetch the Patient object. The Patient object is *mostly* Firebase data that
is returned via password authentication:

https://www.firebase.com/docs/web/guide/login/password.html
*/
angular.module('app.services')
.factory('Onboarding', function(Patient) {
  return {
    ref: function() {
      var ref = new Firebase(onpoint.env.mainURL + "patients/");
      var uid = Patient.uid();
      return ref.child(uid).child("onboarding")
    },

    getFromCloud: function() {
      return this.ref().once("value")
    }
  };
})
