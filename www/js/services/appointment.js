angular.module('app.services')

.factory("Appointment", function() {
  var appointments = [{
    id: 1,
    timestamp: "2016-03-05T10:00:00",
    title: "Appointment with cardiologist Dr.Hart",
    location: "2020 Kittredge Str, Berkeley, 94704",
    note: "Please bring your ID",
  }, {
    id: 2,
    timestamp: "2016-03-10T10:00:00",
    title: "Appointment with nurse Denise",
    location: "517 Oxford Str, Oakaland, 06792",
    note: "Please bring your medication history",
  }, {
    id: 3,
    timestamp: "2016-03-15T10:00:00",
    title: "Appointment with Pharmacist Ken",
    location: "7814 Pingyang Str, SanFrancisco, 93501",
    note: "Please don't eat any food before coming",
  }];

  return {
    get: function() {
      return appointments;
    },
    add: function(newAppointment) {
      appointments.push(newAppointment);
      console.log("pushed new appointment appointments are", appointments)
    },
  };

})
