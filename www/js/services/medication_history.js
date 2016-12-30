angular.module('app.services')

.factory('MedicationHistory', ["Patient", "$firebaseObject","$firebaseArray", "Card","CARD",function(Patient, $firebaseObject,$firebaseArray, Card, CARD) {
  return {
    getTodaysHistory: function() {
      var today = ((new Date()).toISOString()).substring(0,10) //Only get the date: YYYY-MM-DD
      var ref = this.ref().child(today);
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
      return Patient.ref().child("medication_histories");
    },
    create_or_update: function(medication, schedule, choice) {
      // TODO: Refactor this to use AngularFire methods to create only if element
      // does not exist.
      var today = ((new Date()).toISOString()).substring(0,10)
      var ref = this.ref().child(today);
      var time_now = (new Date()).toISOString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      var instanceFB =  { //use this if adding new element
          medication_id: medication.id,
          medication_schedule_id: schedule.$id,
      };

      if (choice == "take") {
        instanceFB.taken_at = time_now;
        updateObject = {'taken_at':time_now};
      }
      else if (choice == "skip") {
        instanceFB.skipped_at = time_now;
        updateObject ={'skipped_at':time_now};
      }

      //Add to or update firebase
      var req = ref.once('value', function(snapshot) {
        if(schedule.$id=='cabinet') {
          instanceFB.reason = typeof(medication.reason)==='undefined'? null:medication.reason;
          var medRef = snapshot.ref();
          cabHistRef = medRef.push(instanceFB);
          Card.createAdHoc(CARD.CATEGORY.MEDICATIONS_CABINET, cabHistRef.key(), (new Date()).toISOString())
        }
        else {
          if(snapshot.exists()) { //this date child exists
            var updated = false;
            snapshot.forEach(function(data) { //find it
              var hist = data.val();
              if (hist.medication_schedule_id ==  schedule.$id && hist.medication_id == medication.id) {
                //found it, need to update it!
                updated = true;
                var medRef = data.ref();
                medRef.update(updateObject);
              }
            });
            if(!updated) {
                //need to push a new one.
                var medRef = snapshot.ref();
                medRef.push(instanceFB);
            }
          } else { //this date child does not exist, push it!
            var medRef = snapshot.ref();
            medRef.push(instanceFB);
          }
        }
      })
      return req;
    },
    findByMedicationIdAndScheduleId: function(med_id, schedule_id) {
      var match;
      for(var i = 0; i < history.length; i++) {
        if (history[i].medication_id == med_id && history[i].medication_schedule_id == schedule_id) {
          match = history[i]
        }
      }
      return match;
    }
  };
}])
