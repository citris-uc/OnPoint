angular.module('app.services', [])

// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Goal.get() returns all goals.
.factory('Goal', function() {

  // TODO create enums for personal vs clinical
  goals = [
    { body: "Remain independent", type: "personal" },
    { body: "Keep visiting with friends and doing my daily activities", type: "personal" },
    { body: "Be able to visit out-of-town family by plane", type: "personal" },
    { body: "Feel healthy", type: "personal" },
    { body: "Control systolic blood pressure to lower than 130/80 mmHg but not less than 90 mmHg.", type: "clinical" },
    { body: "Keep HbA1C levels at 7% or less.", type: "clinical" }
  ];

  return {
    get: function() {
      return goals;
    },
    add: function(goal) {
      goals.push(goal);
    }
  };
})


// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// User.get() will return the user associated with this account.
.factory('User', function() {
  return {
    get: function() {
      return {
        id: 1,
        name: "Dmitri"
      }
    }
  };
})


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
    }
  };

})
