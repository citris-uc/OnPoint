angular.module('app.services')
// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Measurement.get() will return all measurements associated with a user.
.factory("Measurement", ["CARD", "Card", "Patient", "$firebaseArray", function(CARD, Card, Patient, $firebaseArray) {
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

      // Once we've persisted the measurement to Firebase, let's create an associated card
      // in Firebase.
      req.then(function(ref) {
        m.id = ref.key(); // Return the ID to persist it further.

        // Construct the object and card object.
        var object     = {id: ref.key(), type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE};
        var cardObject = { type: CARD.TYPE.ACTION};
        if (m.weight || (m.systolic && m.diastolic) || m.heartRate)
          cardObject.completed_at = now
        if (that.hasHighBP(m))
          cardProp.type = CARD.TYPE.URGENT

        // Finally, find or update the corresponding card.
        Card.find_or_create_by_object(object, cardObject);
      });

      return m;
    }
  };
}] )


.factory('MeasurementSchedule', ["Patient", "$firebaseArray", "$firebaseObject", function(Patient, $firebaseArray, $firebaseObject) {
  return {
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("measurement_schedules")
    },
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref);
    },
    add: function(schedule){
      this.get().$add(schedule);
    },
    getById: function(id){
      return $firebaseObject(this.ref().child(id));
    }
  };
}] )
