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
    getTodaysHistory: function() {
      var today = ((new Date()).toISOString()).substring(0,10) //Only get the date: YYYY-MM-DD
      var ref = this.ref().child(today)
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("measurement_histories")
    },
    hasHighBP: function(measurement) {
      if ( !(measurement["systolic blood pressure"] && measurement["diastolic blood pressure"]) )
        return false;

      if (measurement["systolic blood pressure"] > 160 || measurement["diastolic blood pressure"] < 90)
        return true;
    },

    add: function(measurement, schedule) {
      var today = ((new Date()).toISOString()).substring(0,10)
      var ref = this.ref().child(today);
      var time_now = (new Date()).toTimeString();

      var instance = measurement;
      instance.taken_at = time_now;
      instance.measurement_schedule_id = schedule.$id

        //Add new measurement to firebase
        var req = ref.once('value', function(snapshot) {
          if(snapshot.exists()) { //this date child exists
            snapshot.forEach(function(data) { //find it
              var hist = data.val();
              if (hist.measurement_schedule_id ==  schedule.$id) {
                //found it, need to update it!
                console.log("updating");
                updated = true;
                var measurementsRef = data.ref();
                measurementsRef.update(instance);
              }
            });
            if(!updated) {
                console.log("pushing 1")
                //need to push a new one.
                var measurementsRef = snapshot.ref();
                measurementsRef.push(instance);
            }
          } else { //this date child does not exist, push it!
            console.log("pushing 2")
            var measurementsRef = snapshot.ref();
            measurementsRef.push(instance);
          }

        })
        return req;


      // TODO: Remove this ugliness. We're doing this to reference
      // the current scope before we enter the `then` scope below.
      // var that = this;
      //
      // var measurements = this.get();
      // var req = measurements.$add(m);

      // DEPRECIATED
      // // Once we've persisted the measurement to Firebase, let's create an associated card
      // // in Firebase.
      // req.then(function(ref) {
      //   m.id = ref.key(); // Return the ID to persist it further.
      //
      //   // Construct the object and card object.
      //   var object     = {id: ref.key(), type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE};
      //   var cardObject = { type: CARD.TYPE.ACTION};
      //   if (m.weight || (m.systolic && m.diastolic) || m.heartRate)
      //     cardObject.completed_at = now
      //   if (that.hasHighBP(m))
      //     cardProp.type = CARD.TYPE.URGENT
      //
      //   // Finally, find or update the corresponding card.
      //   Card.find_or_create_by_object(object, cardObject);
      // });
      //
      // return m;
    }
  };
}] )


.factory('MeasurementSchedule', ["Patient", "$firebaseArray", "$firebaseObject","CARD", "Card", function(Patient, $firebaseArray, $firebaseObject, CARD, Card) {
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
    findByID: function(id){
      return $firebaseObject(this.ref().child(id));
    },

    createTodaysCards: function() {
      var req = this.ref().once("value", function(snap) {
        var now    = (new Date()).toISOString();
        var date = now.substring(0,10) //Only get the date: YYYY-MM-DD
        snap.forEach(function(childSnap) {
          schedule = childSnap.val();
          var show = new Date()
          //TODO: update these to be minutes from midnight
          show.setHours(schedule.hour);
          show.setMinutes(schedule.minute);
          var card = {type: CARD.TYPE.ACTION,
                            created_at: now,
                            updated_at: now,
                            completed_at: null,
                            archived_at: null,
                            shown_at: show.toISOString(),
                            num_comments: 0,
                            object_type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE,
                            object_id: childSnap.key() // setting the ID to the firebase reference key!
                          }
          Card.create(date, card);
        })//end snap.forEach
      })// end req
    }
  };
}] )
