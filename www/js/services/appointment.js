angular.module('app.services')
.factory('Appointment',["Patient", "$firebaseObject", "$firebaseArray", "moment", "Card", function(Patient, $firebaseObject,$firebaseArray, moment, Card) {
  // var appointments = [{
  //   id: 1,
  //   timestamp: "2016-03-05T10:00:00",
  //   title: "Appointment with cardiologist Dr.Hart",
  //   location: "2020 Kittredge Str, Berkeley, 94704",
  //   note: "Please bring your ID",
  // }, {
  //   id: 2,
  //   timestamp: "2016-03-10T10:00:00",
  //   title: "Appointment with nurse Denise",
  //   location: "517 Oxford Str, Oakaland, 06792",
  //   note: "Please bring your medication history",
  // }, {
  //   id: 3,
  //   timestamp: "2016-03-15T10:00:00",
  //   title: "Appointment with Pharmacist Ken",
  //   location: "7814 Pingyang Str, SanFrancisco, 93501",
  //   note: "Please don't eat any food before coming",
  // }];

  return {
    getAll: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("appointments")).$loaded()
      })
    },
    get: function(date, id){
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("appointments").child(date).child(appointment_id));
      })
    },
    add: function(appointment) {
      appt = {}
      for (var key in appointment)
        appt[key] = appointment[key]
      appt.date = moment(appointment.date).format('YYYY-MM-DD');
      appt.time = moment(appointment.time).format('HH:mm');
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("appointments").child(appt.date).push(appt).key();
      })
      // .then(function(newKey) {
      //   return Card.createAppointment(newKey, appt)
      // })
    },
    update: function(oldDate, oldKey, appointment) {
      thisAppt  = this
      appt = {}
      for (var key in appointment)
        appt[key] = appointment[key]
      appt.date = moment(appointment.date).format('YYYY-MM-DD');
      appt.time = moment(appointment.time).format('HH:mm');

      puid = null
      return Card.destroyAppointmentCard(oldKey, oldDate).then(function() {
        return Patient.get().then(function(p) {
          return $firebaseObject(Patient.ref(p.uid).child("appointments").child(oldDate).child(oldKey)).$remove()
        })
      }).then(function() {
        return Patient.get().then(function(p) {
          return Patient.ref(p.uid).child("appointments").child(appt.date).push(appt).key();
        });
      })
    },
    destroy: function(appt_date, appt_id) {
      return Card.destroyAppointmentCard(appt_id, appt_date).then(function() {
        return Patient.get().then(function(p) {
          return $firebaseObject(Patient.ref(p.uid).child("appointments").child(appt_date).child(appt_id)).$remove()
        })
      })
    }
  };
}])
