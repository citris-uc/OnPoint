angular.module('app.services', [])

.factory('Medication', function() {
  medications = [
    {name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure."},
    {name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure."},
    {name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure."},
    {name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner."},
    {name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure."},
    {name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes."},
    {name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels."}
  ]

  return {
    getByName: function(name) {
      return medications.find( function(med){ return med.name == name } );
    },
    getByTradeName: function(trade_name) {
      return medications.find( function(med){ return med.trade_name == trade_name } );
    }
  };
})

.factory('MedicationSchedule', ["Medication", function() {
  morning   = ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
  afternoon = ["Lasix", "Toprol XL", "Zestril", "Losartan", "Riomet"]
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
    get: function() {
      return dosage;
    }
  };
}])

.factory('MedicationHistory', ["Medication", function() {
  history = [
    {med_name: "furomeside", taken_at: new Date("2016-03-21 08:00"), skipped_at: null },
    {med_name: "lipitor", taken_at: null, skipped_at: new Date("2016-03-20 19:00") }
  ]
  return {
    get: function() {
      return history;
    }
  };
}])
