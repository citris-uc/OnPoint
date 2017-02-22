angular.module('app.services')

.factory('MedicationHistory', ["Patient", "$firebaseObject","$firebaseArray", "Card", "$http", "moment", function(Patient, $firebaseObject,$firebaseArray, Card, $http, moment) {
  return {
    getHistory: function() {
      date_string = moment(new Date()).format("YYYY-MM-DD")
      console.log(date_string)

      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medication_histories").child(date_string)).$loaded();
      })
    },
    create_or_update: function(medication, schedule, choice) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url:    onpoint.env.serverURL + "medications/decide",
          data: {
            medication_id: medication.$id,
            schedule_id: schedule.$id,
            choice: choice
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    }
  };
}])
