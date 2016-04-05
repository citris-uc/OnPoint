angular.module('app.services')

.factory('Medication',function() {
  medications = [
    {id: 1, name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure."},
    {id: 2, name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure."},
    {id: 3, name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure."},
    {id: 4, name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner."},
    {id: 5, name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure."},
    {id: 6, name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes."},
    {id: 7, name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels."}
  ]
  input_medications = [];

  return {
    get: function() {
      return medications;
    },
    get_inputList: function() {
      return input_medications;
    },
    getByName: function(name) {
      for (var i = 0; i < medications.length; i++) {
        if (medications[i].name == name)
          return medications[i]
      }
    },
    add_inputMed: function(newMed) {
      m = {};
      m.id = input_medications.length + 1;
      m.name = newMed.name;
      m.dosage = newMed.dosage;
      m.timing = newMed.timing;
      m.instructions = newMed.instructions;
      m.purpose = newMed.purpose;
      m.notes = newMed.notes;
      input_medications.push(m);
    },
    getByTradeName: function(trade_name) {
      for (var i = 0; i < medications.length; i++) {
        if (medications[i].trade_name == trade_name)
          return medications[i]
      }
    }
  };
})


.factory('MedicationScheduleFB', ["$firebaseArray", function($firebaseArray) {
  return function(username) {
    // create a reference to the database where we will store our data
    var ref = new Firebase("https://vivid-inferno-5187.firebaseio.com/users");
    var scheduleRef = ref.child(username).child('medicationSchedule');
    // return it as a synchronized object
    return $firebaseArray(scheduleRef);
  }
}])

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", function(Medication) {
  morning   = ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
  afternoon = ["Lasix", "Toprol XL", "Zestril", "Riomet"]
  evening   = ["Lipitor"]

  schedule = [
    {
      id: 1,
      time: "08:00",
      slot: "morning",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action
      medications: morning.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
    },
    {
      id: 2,
      time: "13:00",
      slot: "afternoon",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action,
      medications: afternoon.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
    },
    {
      id: 3,
      time: "19:00",
      slot: "evening",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action,
      medications: evening.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
    }
  ]

  return {
    get: function() {
      return schedule;
    },
    /*
    getByDateAndSlot: function(date, slot) {
      var dateSchedule;
      for (var i = 0; i < schedule.length; i++) {
        if (new Date(schedule[i].scheduled_at).toDateString() == new Date(date).toDateString() && schedule[i].slot == slot)
          dateSchedule = schedule[i]
      }
      return dateSchedule;
    },
    */
    findByID: function(id) {
      var dateSchedule;
      for (var i = 0; i < schedule.length; i++) {
        if (schedule[i].id == id)
          dateSchedule = schedule[i]
      }
      return dateSchedule;
    }
  };
}])

.factory('MedicationDosage', ["Medication", function() {
  morning   = ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
  afternoon = ["Lasix", "Toprol XL", "Zestril", "Losartan", "Riomet"]
  evening   = ["Lipitor"]

  dosage = {
    furomeside: {
      dose: 40,
      tablets: 1,
      required: false
    },
    metformin: {
      dose: 500,
      tablets: 2,
      required: true
    }
  }

  return {
    getByName: function(name) {
      for (var med_name in dosage) {
        if (med_name == name)
          return dosage[med_name]
      }
    }
  };
}])

.factory('MedicationHistory', ["Patient", "$firebaseArray", function(Patient, $firebaseArray) {
  var count = 1;
  var history = [{
      id: 0,
      medication_id: 1,
      medication_schedule_id: 1,
      taken_at: "2016-03-15T08:01:00",
      skipped_at: null
    }, {
      id: 1,
      medication_id: 7,
      medication_schedule_id: 3,
      taken_at: null,
      skipped_at: "2016-03-21T19:00:00"
    }
  ]

  return {
    get: function() {
      return history;
    },
    // TODO: Returns only today's history.
    getBySchedule: function(schedule) {
      var ref = this.ref();
      return $firebaseArray(ref);
    },
    ref: function() {
      return Patient.ref().child("medication_histories");
    },
    create_or_update: function(medication, schedule, choice) {
      // TODO: Refactor this to use AngularFire methods to create only if element
      // does not exist.
      var today = (new Date()).toDateString()
      var ref = this.ref().child(today);
      var time_now = (new Date()).toTimeString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      var instanceFB =  { //use this if adding new element
          medication_id: medication.id,
          medication_schedule_id: schedule.id,
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
        if(snapshot.exists()) { //this date child exists
          var updated = false;
          snapshot.forEach(function(data) { //find it
            var hist = data.val();
            if (hist.medication_schedule_id ==  schedule.id && hist.medication_id == medication.id) {
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
