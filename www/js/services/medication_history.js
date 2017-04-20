angular.module('app.services')

.factory('MedicationHistory', ["Patient", "$firebaseObject","$firebaseArray", "Card", "$http", "moment", "_", function(Patient, $firebaseObject,$firebaseArray, Card, $http, moment, _) {
  return {
    getHistoryForSchedule: function(schedule, date_string) {
      if (!date_string)
        date_string = moment(new Date()).format("YYYY-MM-DD")

      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medication_histories").child(date_string)).$loaded();
      }).then(function(histories) {
        return _.filter(histories, function(h) { return h.medication_schedule_id == schedule.$id}) || []
      })
    },

    decideAll: function(schedule, choice) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url:    onpoint.env.serverURL + "medications/decide_all",
          data: {
            schedule_id: schedule.$id,
            choice: choice
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
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
