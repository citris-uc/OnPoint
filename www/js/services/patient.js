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
      return this.get().then(function(p) {
        var ref = new Firebase(onpoint.env.mainURL + "patients/").child(p.uid)
        return ref.child("session").once("value")
      })
    },
    create: function(patient) {
      thisPatient = this
      return this.get().then(function(p) {
        var ref = new Firebase(onpoint.env.mainURL + "patients/");
        return ref.child(p.uid).child("session").set(patient).then(function(response) {
          thisPatient.save(patient)
        })
      })
    },
    destroy: function() {
      thisPatient = this
      return this.get().then(function(p) {
        return Pouch.patientsDB.remove(p).then(function(doc) {
          return p
        })
      }).then(function(p) {
        var patientRef = new Firebase(onpoint.env.mainURL + "patients/").child(p.uid)
        return $firebaseAuth(thisPatient.ref()).$unauth()
      }).catch(console.log.bind(console));
    },
    login: function(user) {
      thisP = this
      patientRef = new Firebase(onpoint.env.mainURL + "patients/")
      return $firebaseAuth(patientRef).$authWithPassword(user).then(function(res) {
        patient                 = res
        patient.email           = res.password.email
        patient.profileImageURL = res.password.profileImageURL
        return thisP.save(patient)
      })
    },
    ref: function(uid) {
      return new Firebase(onpoint.env.mainURL + "patients/").child(uid);
    },

    // uid: function() {
    //   return $window.localStorage.getItem("uid")
    // },
    // setUID: function(uid) {
    //   return $window.localStorage.setItem("uid", uid)
    // },
    // setAttribute: function(attr, value) {
    //   patient = this.get()
    //   patient[attr] = value
    //   this.set(patient)
    // },
    // setToken: function(token) {
    //   if (token == null)
    //     $window.localStorage.setItem("token", "");
    //   else
    //     $window.localStorage.setItem("token", token);
    // },
    // getToken: function() {
    //   return $window.localStorage.getItem("token");
    // },

    // auth: function() {
    //   return $firebaseAuth(this.ref());
    // },
  };
})
