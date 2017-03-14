
angular.module('app.services')

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", "Patient","$firebaseObject", "$firebaseArray", "$q", "_", function(Medication, Patient, $firebaseObject, $firebaseArray, $q, _) {
  /*
   * This is default schedule for testing purposes
   * TODO: (much later) delete this.
   */
  new_default_schedule = [
    {
      time: "08:00",
      name: "Morning",
      days: [true, true, true, true, true, true, true]
    },
    {
      time: "13:00",
      name: "Afternoon",
      days: [true, true, true, true, true, true, true]
    },
    {
      time: "19:00",
      name: "Evening",
      days: [true, true, true, true, true, true, true]
    },
    {
      time: "21:00",
      name: "Bedtime",
      days: [true, true, true, true, true, true, true]
    }
  ]
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
    setDefaultSchedule: function() {
      ref = null
      return Patient.get().then(function(p) {
        ref = Patient.ref(p.uid).child("medication_schedule")
        return $firebaseArray(ref).$loaded().then(function(schedule) {
          if (schedule.length == 0) {
            return $q.all( new_default_schedule.map(function(row) { return ref.push(row)}) )
          } else
            return schedule;
        })
      })
    },

    get: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medication_schedule")).$loaded()
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
      uid = null
      return Patient.get().then(function(p) {
        uid = p.uid
        return Patient.ref(uid).child("medication_schedule").child(id).child("medications").once("value")
      }).then(function(meds) {
        medications = []
        if (meds.val())
          medications = Object.values(meds.val())
        should_update = (_.findIndex(medications, function(m) { return m.id == medication.$id}) == -1)

        if (should_update == true) {
          ref = Patient.ref(uid).child("medication_schedule").child(id).child("medications");
          newMessageRef = ref.push();
          return newMessageRef.set({id: medication.$id, name: medication.name});
        }
      })
    },

    removeMedication: function(id, medication) {
      return Patient.get().then(function(p) {
        thisRef = Patient.ref(p.uid).child("medication_schedule").child(id).child("medications")

        return $firebaseArray(thisRef).$loaded().then(function(medications) {
          indexToRemove = _.findIndex(medications, function(m) { return m.id == medication.id})

          console.log(indexToRemove)
          if (indexToRemove >= 0) {
            console.log(medications[indexToRemove])
            medications.$remove(indexToRemove)
          }
        })
      }).catch(function(err) {
        console.log(err)
      })
    }
  };
}])
