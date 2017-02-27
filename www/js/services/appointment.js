angular.module('app.services')
.factory('Appointment',["Patient", "$firebaseObject", "$firebaseArray", "moment", function(Patient, $firebaseObject,$firebaseArray, moment) {
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
    /*
     * Return Appointments in firebase from dates, from, until dates, to
     * @param from: from date in javascript date format
     * @param to: to date in javascript date format
     * @return: returns a firebaseArray of appointments
     */
    // getAppointmentsFromTo: function(from, to) {
    //   var ref = this.getAppointmentsFromToRef(from,to)
    //   return $firebaseArray(ref);
    // },
    // getAppointmentsFromToRef: function(from, to) {
    //   var fromISO = from.toISOString().substring(0,10);
    //   var toISO = to.toISOString().substring(0,10);
    //   var ref = this.ref().orderByKey().startAt(fromISO).endAt(toISO);
    //   return ref;
    // },

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
        return Patient.ref(p.uid).child("appointments").child(appt.date).push(appt);
      });
    },
    update: function(oldDate, oldKey, appointment) {
      console.log("Updating...")
      console.log(oldDate)
      console.log(oldKey)
      console.log(appointment.date)
      console.log(appointment.time)
      console.log("--------------")

      thisAppt  = this
      appt = {}
      for (var key in appointment)
        appt[key] = appointment[key]
      appt.date = moment(appointment.date).format('YYYY-MM-DD');
      appt.time = moment(appointment.time).format('HH:mm');

      console.log("Dates converted: ")

      puid = null
      return Patient.get().then(function(p) {
        puid = p.uid
        return $firebaseObject(Patient.ref(puid).child("appointments").child(oldDate).child(oldKey)).$remove()
      }).then(function(oldAppt) {
        return Patient.get().then(function(p) {
          return Patient.ref(p.uid).child("appointments").child(appt.date).push(appt);
        });
      })
    },
    destroy: function(appt_date, appt_id) {
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("appointments").child(appt_date).child(appt_id)).$remove()
      })
    }
  };
}])
