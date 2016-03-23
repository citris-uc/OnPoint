angular.module('app.services')

.factory('Medication', function() {
  medications = [
    {id: 1, name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure."},
    {id: 2, name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure."},
    {id: 3, name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure."},
    {id: 4, name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner."},
    {id: 5, name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure."},
    {id: 6, name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes."},
    {id: 7, name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels."}
  ]

  return {
    get: function() {
      return medications;
    },
    getByName: function(name) {
      for (var i = 0; i < medications.length; i++) {
        if (medications[i].name == name)
          return medications[i]
      }
    },
    getByTradeName: function(trade_name) {
      for (var i = 0; i < medications.length; i++) {
        if (medications[i].trade_name == trade_name)
          return medications[i]
      }
    }
  };
})

// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication", function(Medication) {
  morning   = ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
  afternoon = ["Lasix", "Toprol XL", "Zestril", "Riomet"]
  evening   = ["Lipitor"]

  schedule = [
    {
      id: 1,
      time: [00,00,00], //in HR, MIN, SEC format
      slot: "morning",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action
      medications: morning.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
    },
    {
      id: 2,
      time: [13,00,00],//in HR, MIN, SEC format
      slot: "afternoon",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action,
      medications: afternoon.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
    },
    {
      id: 3,
      time: [19,00,00], //in HR, MIN, SEC format
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

.factory('MedicationHistory', ["Medication", function() {
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

    create_or_update: function(medication, schedule, choice) {
      var instance = this.findByMedicationIdAndScheduleId(medication.id, schedule.id)
      if (!instance) {
        instance = {
          id: history.length + 1,
          medication_id: medication.id,
          medication_schedule_id: schedule.id
        }

        history.push(instance);
      }

      // NOTE: We should still be able to update the object after we've pushed
      // it to the array.
      now = (new Date()).toISOString();
      if (choice == "take")
        instance.taken_at = now
      else if (choice == "skip")
        instance.skipped_at = now
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
