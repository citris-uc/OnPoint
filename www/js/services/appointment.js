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
    getById: function(appointment_id){
       console.log(appointment_id);
      return $firebaseObject(this.ref().child(appointment_id));
    },
    add: function(appointment) {
      // Replace with Firebase
      var a = {
        time: appointment.time.toISOString(),
        title: appointment.title,
        location: appointment.location,
        note: appointment.note
      }
      console.log(a);

      var appointments = this.get();
      var req = appointments.$add(a);

      return a;
    }
  };
}])
