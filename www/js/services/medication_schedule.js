
angular.module('app.services')

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", "Patient","$firebaseObject", "$firebaseArray", "$q", function(Medication, Patient, $firebaseObject, $firebaseArray, $q) {
  /*
   * This is default schedule for testing purposes
   * TODO: (much later) delete this.
   */
  schedule = [
    {
      time: "08:00",
      name: "Morning",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action
      medications: ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
    },
    {
      time: "13:00",
      name: "Afternoon",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action,
      medications: ["Lasix", "Toprol XL", "Zestril", "Riomet"]
    },
    {
      time: "19:00",
      name: "Evening",
      days: [true, true, true, true, true, true, true], //array descirbing days of week to do this action,
      medications: ["Lipitor"]
    }
  ]

  return {
    /*
     * Temporary method for clinician testing
     */
    setDefaultSchedule: function() {
      return Patient.get().then(function(p) {
        ref = Patient.ref(p.uid).child("medication_schedule")
        return $q.all( schedule.map(function(row) { return ref.push(row)}) )
      })
    },

    get: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medication_schedule"))
      })
    },

    getByID: function(id) {
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("medication_schedule").child(id));
      })
    },

    // Add a time slot to the schedule
    add: function(slot){
      hours = slot.time.getHours();
      mins  = slot.time.getMinutes();
      hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) )
      mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) )
      time  = hours + ":" + mins;

      var instanceFB =  {
        time: time,
        name: slot.name,
        days: slot.days
      };

      return this.get().then(function(docs) {
        docs.$add(instanceFB);
      })
    },

    addMedication: function(id, medication) {
      return this.getByID(id).then(function(slot) {
        console.log(slot)
        if (!slot.medications) {
          slot.medications = []
        }

        if (slot.medications.indexOf(medication) === -1) {
          slot.medications.push(medication)
        }

        return slot.$save()
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
      thisMS = this

      return Patient.get().then(function(p) {
        ref = Patient.ref(p.uid).child("medication_schedule").child(id)
        return $firebaseArray(ref.child("medications")).$loaded().then(function(res) {

          for(var i = 0; i < res.length; i++) {
            if (medication == res[i].$value)
              res.$remove(i);
          }
        }).catch(function(err) {
          console.log(err)
        })

        // return ref.child("medications").on("value", function(response) {
        //   console.log(response.val())
        //   medications = response.val()
        //   for (var i=0; i < medications.length; i++) {
        //     if (medications[i] == medication) {
        //       medications.splice(i, 1)
        //       break
        //     }
        //   }
        //
        //   return ref.update({medications: medications})
        // })
      })
    }
  };
}])
