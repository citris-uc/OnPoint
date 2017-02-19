angular.module('app.services')

.factory('MedicationHistory', ["Patient", "$firebaseObject","$firebaseArray", "Card","CARD", "$http", function(Patient, $firebaseObject,$firebaseArray, Card, CARD, $http) {
  return {
    getTodaysHistory: function() {
      var today = ((new Date()).toISOString()).substring(0,10) //Only get the date: YYYY-MM-DD

      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medication_histories").child(today));
      })
    },
    create_or_update: function(medication, schedule, choice) {
      return $http({
        method: "PUT",
        url:    onpoint.env.serverURL + "medications/decide",
        data: {
          medication_id: medication.id,
          schedule_id: schedule.$id,
          choice: choice
        },
        headers: {
         "Authorization": "Bearer " + Patient.getToken()
        }
      })
    }
  };
}])
