
angular.module('app.services')

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('CareTeam', ["Patient","$firebaseObject", "$firebaseArray", "$q", "_", "$http", function(Patient, $firebaseObject, $firebaseArray, $q, _, $http) {
  return {

    add: function(member) {
      return Patient.get().then(function(p) {
        ref = Patient.ref(p.uid).child("care_team").push()
        return ref.set(member)
      })
    },

    update: function(member) {
      new_member = _.pick(member, "name", "title", "email", "phone_number", "address", "note")
      console.log(new_member)

      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("care_team").child(member.$id).update(new_member)
      })
    },

    destroy: function(member) {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("care_team").child(member.$id).remove()
      })
    },

    getAll: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("care_team")).$loaded()
      })
    }
  };
}])
