angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationSchedule", "MeasurementSchedule", "$firebaseArray", "$firebaseObject", "$http", "moment", function(CARD, Patient, MedicationSchedule, MeasurementSchedule, $firebaseArray, $firebaseObject, $http, moment) {
  return {
    getByID: function(id) {
      return Patient.get().then(function(p) {
        date_string = moment(new Date()).format("YYYY-MM-DD")
        return $firebaseObject(Patient.ref(p.uid).child("cards").child(date_string).child(id))
      })
    },

    today: function() {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "cards?upcoming=1",
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    history: function(end_date_string) {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "cards/history?end_date=" + end_date_string,
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    destroyAppointmentCard: function(firebase_id, appt_date) {
      console.log("DESTROYING APPOINTMENT: ")
      console.log(firebase_id)
      console.log(appt_date)
      console.log("-------")
      return Patient.get().then(function(p) {
        return $http({
          method: "DELETE",
          url:    onpoint.env.serverURL + "cards/destroy_appointment",
          params: {
            appointment_id: firebase_id,
            appointment_date: appt_date
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    forceGenerate: function() {
      return Patient.get().then(function(p) {
        return $http({
          method: "DELETE",
          url:    onpoint.env.serverURL + "cards/force",
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    }
  }
}])
