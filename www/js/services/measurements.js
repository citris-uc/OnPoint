angular.module('app.services')
// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Measurement.get() will return all measurements associated with a user.
.factory("Measurement", ["CARD", "Card", "Patient", "$firebaseArray", function(CARD, Card, Patient, $firebaseArray) {
  var measurements = [
    {
      id: 1,
      weight: "160",
      systolic: "120",
      diastolic: "112",
      heartRate: "60",
      created_at: "2016-03-01T10:00",
    }, {
      id: 2,
      weight: "165",
      systolic: "150",
      diastolic: "130",
      heartRate: "75",
      created_at: "2016-03-02T10:00"
    }
  ];

  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("measurements")
    },
    hasHighBP: function(measurement) {
      if ( !(measurement.systolic && measurement.diastolic) )
        return false;

      if (measurement.systolic > 160 || measurement.systolic < 90)
        return true;
    },

    add: function(measurement) {
      now = (new Date()).toISOString();

      // Replace with Firebase
      var m = {
        weight: measurement.weight,
        systolic: measurement.systolic,
        diastolic: measurement.diastolic,
        heart_rate: measurement.heartRate,
        created_at: now
      }

      // TODO: Remove this ugliness. We're doing this to reference
      // the current scope before we enter the `then` scope below.
      var that = this;

      var measurements = this.get();
      var req = measurements.$add(m);
      req.then(function(ref) {
        m.id = ref.key();

        // At this point, let's find, or create an associated
        // card.
        var card = Card.find_by_object(m.id, CARD.CATEGORY.MEASUREMENTS);
        if (!card)
          card = Card.create_from_object(m, CARD.CATEGORY.MEASUREMENTS, CARD.TYPE.ACTION)

        // Let's update the timestamps.
        if (m.weight || (m.systolic && m.diastolic) || m.heartRate) {
          card.updated_at   = now
          card.completed_at = now
        }

        // Finally, let's check if the blood pressure is out of range, and if so,
        // change this card to urgent.
        if (that.hasHighBP(m))
          card.type = CARD.TYPE.URGENT
      });

      return m;
    }
  };
}] )




.factory('MeasurementSchedule', function() {
  var schedule = [{
      id :1 ,
      time :"08:00",
      days: [0,1,2,3,4,5,6],
      measurements :["weight", "systolic", "diastolic", "heart_rate"]
    }, {
      id: 2,
      time: "16:00",
      days: [0,1,2,3,4,5,6],
      measurements :["systolic", "diastolic", "heart_rate"]
    }];

  return {
    get: function() {
      return schedule;
    }
  };
})
