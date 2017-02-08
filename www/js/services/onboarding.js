/*
This factory abstracts the interaction with the persistence layer to
fetch the Patient object. The Patient object is *mostly* Firebase data that
is returned via password authentication:

https://www.firebase.com/docs/web/guide/login/password.html
*/
angular.module('app.services')
.factory('Onboarding', function(Patient) {
  return {
    getFromCloud: function() {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("onboarding").once("value")
      }).then(function(doc) {
        return doc.val()
      }).catch(console.log.bind(console));
    },

    update: function(onboarding) {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("onboarding").update(onboarding)
      })
    }
  };
})
