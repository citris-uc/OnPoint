/*
This factory abstracts the interaction with the persistence layer to
fetch the Patient object. The Patient object is *mostly* Firebase data that
is returned via password authentication:

https://www.firebase.com/docs/web/guide/login/password.html
*/
angular.module('app.services')
.factory('Patient', function($window, $firebaseAuth, $firebaseObject, Pouch, $q) {
  return {
    get: function() {
      return $q.when(Pouch.patientsDB.get("session"))
    },
    save: function(patient) {
      return Pouch.patientsDB.upsert("session", function(doc){
        for (var key in patient) {
          doc[key] = patient[key]
        }
        return doc
      }).then(function() {
        return patient
      }).catch(console.log.bind(console));
    },
    getFromFirebase: function() {
      thisP = this
      return this.get().then(function(p) {
        return thisP.ref().child("session").once("value")
      })
    },
    create: function(patient) {
      thisP = this
      return this.get().then(function(p) {
        return thisP.ref(p.uid).child("session").set(patient).then(function(response) {
          console.log("SAVING ")
          console.log(response)
          thisPatient.save(patient)
        })
      })
    },
    destroy: function() {
      thisP = this
      return this.get().then(function(p) {
        return Pouch.patientsDB.remove(p).then(function(doc) {
          return p
        })
      }).then(function(p) {
        return $firebaseAuth(thisP.ref(p.uid)).$unauth()
      }).catch(console.log.bind(console));
    },
    login: function(user) {
      thisP = this
      patientRef = new Firebase(onpoint.env.mainURL + "patients/")
      return $firebaseAuth(patientRef).$authWithPassword(user).then(function(res) {
        patient                 = res
        patient.profileImageURL = res.password.profileImageURL
        return thisP.save(patient)
      })
    },
    create: function(user) {
      thisP = this
      patientRef = new Firebase(onpoint.env.mainURL + "patients/")
      return $firebaseAuth(patientRef).$createUser(user).then(function(res) {
        patient     = user
        patient.uid = res.uid
        return thisP.save(patient)
      })
    },
    ref: function(uid) {
      return new Firebase(onpoint.env.mainURL + "patients/").child(uid);
    },
  };
})
