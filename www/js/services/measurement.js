angular.module('app.services')
// Factories allows us to define objects within our app. We can expose
// specific methods within the object literal to mimic API calls, e.g.
// Measurement.get() will return all measurements associated with a user.
.factory("Measurement", ["Patient", "$firebaseObject", "$firebaseArray", function(Patient, $firebaseObject, $firebaseArray) {
  return {
    getAll: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("measurements")).$loaded()
      })
    },

    getSchedule: function() {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("measurement_schedule").once("value")
      }).then(function(doc) {
        return doc.val()
      })
    },
    updateSchedule: function(schedule) {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("measurement_schedule").update(schedule)
      })
    },

    add: function(m) {
      if (!m.measured_at)
        m.measured_at = moment().format("YYYY-MM-DD")

      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("measurements").push(m)
      })
    },
    update: function(measurement) {

      measurement_to_save    = angular.copy(measurement)
      id = measurement_to_save.$id
      delete measurement_to_save.$id
      delete measurement_to_save.$priority


      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("measurements").child(id).update(measurement_to_save)
      })
    },
    destroy: function(appt_date, appt_id) {
      // return Card.destroyAppointment(appt_id, appt_date).then(function() {
      //   return Patient.get().then(function(p) {
      //     return $firebaseObject(Patient.ref(p.uid).child("appointments").child(appt_date).child(appt_id)).$remove()
      //   })
      // })
    },


    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getTodaysHistory: function() {
      var today = ((new Date()).toISOString()).substring(0,10) //Only get the date: YYYY-MM-DD
      var ref = this.ref().child(today)
      return $firebaseArray(ref);
    },
    // Return an object so we can directly get a date's histories instead of iterating thru array.
    getHistoryRange: function(from, to) {
      var fromISO = from.toISOString().substring(0,10);
      var toISO = to.toISOString().substring(0,10);
      var ref = this.ref().orderByKey().startAt(fromISO).endAt(toISO);
      return $firebaseObject(ref);
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

    // add: function(measurement, schedule) {
    //   var today = ((new Date()).toISOString()).substring(0,10)
    //   var ref = this.ref().child(today);
    //   var time_now = (new Date()).toISOString();
    //
    //   var instance = {};
    //   instance.measurements = measurement;
    //   instance.taken_at = time_now;
    //   instance.measurement_schedule_id = schedule.$id
    //
    //   //Add new measurement to firebase
    //   var req = ref.once('value', function(snapshot) {
    //       var measurementsRef = snapshot.ref();
    //       var measLogRef = measurementsRef.push(instance);
    //       if(schedule.$id=='custom')
    //         Card.createAdHoc(CARD.CATEGORY.MEASUREMENT_LOGGED, measLogRef.key(), (new Date()).toISOString())
    //   })
    //   return req;
    // }
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
      return this.get().$add(schedule);
    },
    findByID: function(id){
      return $firebaseObject(this.ref().child(id));
    }
  };
}] )
