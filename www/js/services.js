angular.module('app.services', [])

// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Goal.get() returns all goals.
.factory('Goal', function() {
  var personal_goals = [{
    id: 1,
    body: "Remain independent"
  }, {
    id: 2,
    body: "Keep visiting with friends and doing my daily activities"
  }, {
    id: 3,
    body: "Be able to visit out-of-town family by plane"
  }, {
    id: 4,
    body: "Feel healthy"
  }];


  return {
    get: function() {
      return personal_goals
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

// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Measurement.get() will return all measurements associated with a user.
.factory("Measurement", function() {
  var measurements = [{
    id: 1,
    timestamp: "2016-03-01 10:00",
    weight: "160",
    blood_pressure: "150/140",
    heart_rate: "60"
  }, {
    id: 2,
    timestamp: "2016-03-02 10:00",
    weight: "165",
    blood_pressure: "150/140",
    heart_rate: "75"
  }];

  return {
    get: function() {
      return measurements;
    }
  };

})
