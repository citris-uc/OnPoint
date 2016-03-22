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

.factory('MedicationSchedule', ["Medication", function(Medication) {
  morning   = ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
  afternoon = ["Lasix", "Toprol XL", "Zestril", "Riomet"]
  evening   = ["Lipitor"]

  schedule = {
    morning:   morning.map( function(trade_name) { return Medication.getByTradeName(trade_name) } ),
    afternoon: afternoon.map( function(trade_name) { return Medication.getByTradeName(trade_name) } ),
    evening:   evening.map( function(trade_name) { return Medication.getByTradeName(trade_name) } )
  }

  return {
    get: function() {
      return schedule;
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
      med_id: 1, 
      scheudled_date: (new Date("2016-03-21 08:00")).toDateString(), //just get the DATE PORTION
      scheuduled_slot: 'morning',
      taken_at: new Date("2016-03-21 08:01"), 
      skipped_at: null 
    }, {
      id: 1,
      med_id: 7, 
      scheudled_date: (new Date("2016-03-22 19:00")).toDateString(),
      scheuduled_slot: 'evening',
      taken_at: null, 
      skipped_at: new Date("2016-03-21 19:01") }
  ]
  return {
    get: function() {
      return history;
    },
    add: function(med_id,date,slot,taken,skipped) {
      count = count+1;
      history.push({id: count,
                    med_id: med_id,
                    scheudled_date: date,
                    scheuduled_slot: slot,
                    taken_at: taken,
                    skipped_at: skipped});
      console.log(history);
    },
    
    update: function(id,property,value) {
      history[id][property] = value;
    },

    find: function(med_id, slot, date) {
      for(var i = 0; i < history.length; i++) {
        if (history[i].scheudled_date.valueOf() == date.valueOf() && 
            history[i].scheuduled_slot == slot && history[i].med_id == med_id) {
          return history[i].id;
        }
      }
      return null;
    },

    taken: function(id) {
      if (history[id]['taken_at'] != null)
        return true;
      return false;
    },

    skipped: function(id) {
      if (history[id]['skipped_at'] != null)
        return true;
      return false;
    }

  };
}])
