angular.module('app.services', [])

// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Goal.get() returns all goals.
.factory('Goal', function() {
  var goals = [{goals_name: "personal",
                goals_data: [{ 
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
                              }]
                },
                {goals_name: "clinical",
                goals_data: [{ 
                                id: 1,
                                body: "Control systolic blood pressure to lower than 130/80 mmHg but not less than 90 mmHg."
                              }, {
                                id: 2,
                                body: "Keep HbA1C levels at 7% or less."
                            }]
                }];


  return {
    get: function() {
      return goals;
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
    timestamp: "2016-03-01T10:00",
    weight: "160",
    systolic: "120",
    diastolic: "112",
    heart_rate: "60"
  }, {
    id: 2,
    timestamp: "2016-03-02T10:00",
    weight: "165",
    systolic: "150",
    diastolic: "130",
    heart_rate: "75"
  }];

  return {
    get: function() {
      return measurements;
    }
  };

})
