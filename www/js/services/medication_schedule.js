
angular.module('app.services')

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", "Patient","$firebaseObject", "$firebaseArray", function(Medication, Patient, $firebaseObject,$firebaseArray) {
  /*
   * This is default schedule for testing purposes
   * TODO: (much later) delete this.
   */
  schedule = [
    {
      time: "08:00",
      slot: "Morning",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action
      medications: ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
    },
    {
      time: "13:00",
      slot: "Afternoon",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action,
      medications: ["Lasix", "Toprol XL", "Zestril", "Riomet"]
    },
    {
      time: "19:00",
      slot: "Evening",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action,
      medications: ["Lipitor"]
    }
  ]

  return {
    /*
     * Temporary method for clinician testing
     */
    setDefaultSchedule: function() {
      // var ref = this.ref().child("default")
      var ref = this.ref()
      ref.once("value", function(snapshot) {
        if (!snapshot.exists()) { //only push default schedule once.
          for(var i = 0; i < schedule.length; i++) {
            ref.push(schedule[i]);
          }
        }
      })

    },

    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("medication_schedule")
    },

    /*
     * queries firebase data and returns the default from firebase
     * returns a $firebaseArray, this IS NOT A PROMISE. CANNOT CALL THE THEN METHOD ON this
     * use this to display the schedule on the view layer.
     */
    get: function() {
      // var ref = this.ref().child("default");
      var ref = this.ref()
      return $firebaseArray(ref);
    },

    /*
     * queries firebase data and returns the default from firebase
     * this method will return a PROMISE, so we can call the then method on the promise
     * and update other $scope variables once the promise has been fulfilled.
     * use this when we need to use the schedule to create other things, i.e. generateCardsForToday()
     */
    getAsPromise: function() {
      var ref = this.ref().child("default").once("value");
      return ref;
    },

    /*
     * querues firebase returns a specific scheduleId within this patients
     * firebase default
     * returns a $firebaseObject, THIS IS NOT A PROMISE. TREAT IT LIKE A REAL OBJECT
     * use this to display the specific schedule on an html page.
     */
    findByID: function(id) {
      var ref = this.ref().child("default").child(id)
      return $firebaseObject(ref);
    },

    // Add a time slot to the schedule
    addTimeSlot: function(slotName, daysArray, time){
      var ref = this.get();
      var instanceFB =  { //use this if adding new element
        time: time,
        slot: slotName,
        days: daysArray,
      };
      return ref.$add(instanceFB);
    }
  };
}])
