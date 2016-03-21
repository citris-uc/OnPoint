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
    timestamp: "2016-03-01T10:00",
    weight: "160",
    systolic: "120",
    diastolic: "112",
    heartRate: "60"
  }, {
    timestamp: "2016-03-02T10:00",
    weight: "165",
    systolic: "150",
    diastolic: "130",
    heartRate: "75"
  }];

  return {
    get: function() {
      return measurements;
    },

    add: function(date,newWeight,newSystolic,newDiastolic,newHR) {
      console.log(measurements.length);
      measurements.push({timestamp: date,
                         weight: (newWeight),
                         systolic: (newSystolic),
                         diastolic: (newDiastolic),
                         heartRate: (newHR)});
    }
  };

})

.factory('MeasurementTips', function() {
  var measurementTips = [{
    id: 1,
    measurement: "Weight",
    tips: []
  }, {
    id: 2,
    measurement: "Blood Pressure",
    tips: ["Be still.",
           "Make sure you haven't had any caffeine, tobacco, or exercise in the last 30 minutes",
           "Wait one minute before taking another measurement",
           "Make sure you are sitting down, with your back supported by a chair and your feet on the floor"]
  }, {
    id: 3,
    measurement: "Heart Rate",
    tips: []
  }];

  return {
    get: function() {
      return measurementTips;
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


.factory("TimelineCards", function(cardType, cardState, cardCategory) {
  var cards = [{
    cardID: 0,
    createdTimestamp: "2016-03-15T10:00:00",
    presentedTimestamp: "2016-03-15T10:00:00",
    updatedTimestamp: "2016-03-15T10:00:00", //should arrange timeline by this timestamp
    cardType: cardType.action,
    cardState: cardState.active,
    cardCategory: cardCategory.medications,
    cardTitle: "Take Medications",
    cardContent: "Lasix, Toprol, Zestril, Coumadin, Losartan, Riomet"
  }, {
    cardID: 1,
    createdTimestamp: "2016-03-15T11:00:00",
    presentedTimestamp: "2016-03-15T11:00:00",
    updatedTimestamp: "2016-03-15T11:00:00", //should arrange timeline by this timestamp
    cardType: cardType.action,
    cardState: cardState.active,
    cardCategory: cardCategory.measurements,
    cardTitle: "Take Measurement",
    cardContent: "Weight, Blood Pressure and Heart Rate"
  }, {
    cardID: 2,
    createdTimestamp: "2016-03-15T12:00:00",
    presentedTimestamp: "2016-03-15T12:00:00",
    updatedTimestamp: "2016-03-15T12:00:00", //should arrange timeline by this timestamp
    cardType: cardType.reminder,
    cardState: cardState.active,
    cardCategory: cardCategory.appointments,
    cardTitle: "Appointment Reminder",
    cardContent: "Appointment with cardiologist Dr.Hart tomorrow at 9:00 AM"
  }];

  return {
    get: function() {
      return cards;
    }
  };
})
