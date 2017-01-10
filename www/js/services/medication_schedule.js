
angular.module('app.services')

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", "Patient","$firebaseObject", "$firebaseArray", "$http", function(Medication, Patient, $firebaseObject,$firebaseArray, $http) {
  return {
    /*
     * Temporary method for clinician testing
     */
    setDefaultSchedule: function() {
      return $http({
        method: "POST",
        url:    onpoint.env.serverURL + "medication_schedule",
        headers: {
         "Authorization": "Bearer " + Patient.getToken()
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
      return $firebaseArray(ref)

      // .$loaded().then(function(response) {
      //   console.log(response)
      //   return response

        // med_names = []
        //
        // var uid = Patient.uid();
        // query = Patient.ref(uid).child("medications")
        // query.once("value").then(function(snapshot) {
        //
        //   snapshot.forEach(function(childSnapshot) {
        //     // key will be "ada" the first time and "alan" the second time
        //     var key = childSnapshot.key;
        //     // console.log(key)
        //     // childData will be the actual contents of the child
        //     var childData = childSnapshot.val();
        //     if (childData)
        //       med_names = childData.map(function(med) { return med.trade_name})
        //   });
        // })
      // });
    },

    /*
     * queries firebase data and returns the default from firebase
     * this method will return a PROMISE, so we can call the then method on the promise
     * and update other $scope variables once the promise has been fulfilled.
     * use this when we need to use the schedule to create other things, i.e. generateCardsForToday()
     */
    getAsPromise: function() {
      // var ref = this.ref().child("default").once("value");
      var ref =this.ref().once("value");
      return ref;
    },

    /*
     * querues firebase returns a specific scheduleId within this patients
     * firebase default
     * returns a $firebaseObject, THIS IS NOT A PROMISE. TREAT IT LIKE A REAL OBJECT
     * use this to display the specific schedule on an html page.
     */
    findByID: function(id) {
      // var ref = this.ref().child("default").child(id)
      var ref = this.ref().child(id)
      return $firebaseObject(ref);
    },

    // Add a time slot to the schedule
    addTimeSlot: function(slotName, daysArray, time){
      var ref = this.get();
      var instanceFB =  { //use this if adding new element
        time: time,
        name: slotName,
        days: daysArray,
      };
      return ref.$add(instanceFB);
    },

    addMedication: function(id, medication) {
      console.log(id)
      console.log(medication)
      that = this
      slot = that.findByID(id)
      slot.$loaded().then(function(response) {
        medications = response.medications
        if (medications.indexOf(medication) === -1) {
          medications.push(medication)
          slot.medications = medications
          slot.$save()
        }
      })

      // .on("value", function(snap) {
      //   meds = snap.val()
      //   for (var i=0; i< meds.length; i++) {
      //     console.log(meds[i])
      //   }
      //   if (meds.indexOf(medication) == -1) {
      //     meds.push(medication)
      //     return $firebaseArray(this.ref().child(id).child("medications")).$add(medication)
      //   } else {
      //     return $firebaseArray(this.ref().child(id).child("medications"))
      //   }
      //
      // })



      // arrs = $firebaseArray(meds);
      // console.log(arrs)
      // console.log(arrs.$indexFor(medication))
      // .then(function(response) {
      //   console.log(response)
      //   name = response.name.trade_name
      //   console.log(name)
      // })
    },

    removeMedication: function(id, medication) {
      that = this
      this.ref().child(id).child("medications").on("value", function(response) {
        medications = response.val()
        for (var i=0; i < medications.length; i++) {
          if (medications[i] == medication) {
            medications.splice(i, 1)
            break
          }
        }
        that.ref().child(id).update({medications: medications})
      })


      // console.log(index)
    }
  };
}])
