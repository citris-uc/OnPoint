angular.module('app.services')

.factory('MedicationHistory', ["Patient", "$firebaseObject","$firebaseArray", "Card", "$http", "moment", "_", function(Patient, $firebaseObject,$firebaseArray, Card, $http, moment, _) {
  return {
    getHistoryForSchedule: function(date_string, schedule) {
      if (!date_string)
        date_string = moment(new Date()).format("YYYY-MM-DD")

      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("medication_histories").child(date_string).child(schedule.$id)).$loaded();
      }).then(function(histories) {
        return histories || {}
      })
    },

    decideAll: function(schedule, date, choice) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url:    onpoint.env.serverURL + "medications/decide_all",
          data: {
            schedule_id: schedule.$id,
            date: date,
            choice: choice
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    decide: function(medication, schedule, date, choice) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url:    onpoint.env.serverURL + "medications/decide",
          data: {
            medication: medication,
            date: date,
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
