angular.module('app.services')
.factory('Appointment',["Patient","$firebaseObject", "$firebaseArray", function(Patient, $firebaseObject,$firebaseArray) {
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
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("appointments")
    },
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref);
      //return medications;
    },
    /*
     * Return Appointments in firebase from dates, from, until dates, to
     * @param from: from date in javascript date format
     * @param to: to date in javascript date format
     * @return: returns a firebaseArray of appointments
     */
    getAppointmentsFromTo: function(from, to) {
      var ref = this.getAppointmentsFromToRef(from,to)
      return $firebaseArray(ref);
    },
    getAppointmentsFromToRef: function(from, to) {
      var fromISO = from.toISOString().substring(0,10);
      var toISO = to.toISOString().substring(0,10);
      var ref = this.ref().orderByKey().startAt(fromISO).endAt(toISO);
      return ref;
    },

    getById: function(date,appointment_id){
      return $firebaseObject(this.ref().child(date).child(appointment_id));
    },
    add: function(appointment) {
      var apptDate = (appointment.time.toISOString()).substring(0,10);
      var ref = this.ref().child(apptDate);
      var a = {
        time: appointment.time.toISOString(),
        title: appointment.title,
        location: appointment.location,
        note: appointment.note
      }
      ref.push(a);
    }
  };
}])
