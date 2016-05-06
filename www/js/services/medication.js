angular.module('app.services')

.factory('Medication',["Patient","$firebaseObject", "$firebaseArray", function(Patient, $firebaseObject,$firebaseArray) {
  /*
   * These are default medcations set/instructions for testing purposes
   * TODO: delete id field
   * TODO: (much later) delete this.
   */
  medications = [
    {id: 1, name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure.", dose: 40, tablets: 1, required: false},
    {id: 2, name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure.", dose: 500, tablets: 2, required: true},
    {id: 3, name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure.", dose: 40, tablets: 3, required: false},
    {id: 4, name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner.", dose: 500, tablets: 4, required: true},
    {id: 5, name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure.", dose: 40, tablets: 5, required: false},
    {id: 6, name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes.", dose: 40, tablets: 6, required: false},
    {id: 7, name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels.", dose: 40, tablets: 7, required: false}
  ]
  input_medications = [];

  return {

    /*
     * Temporary method for clinician testing
     */
    setDefaultMeds: function() {
      ref = this.ref();
      for(var i = 0; i < medications.length; i++) {
        ref.push(medications[i]); //Each Med will have its own unique ID generated by FB!
      }
    },

    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("medications")
    },

    cabRef: function(){
      var uid = Patient.uid();
      return Patient.ref(uid).child("cabinet_medications")
    },
    saveCabMed: function(newCabMed) {
      this.cabRef().push(newCabMed)
    },
    add: function(med) {
      this.ref().push(med)
    },
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref);
      //return medications;
    },
    getCabMeds: function(){
      var ref = this.cabRef();
      return $firebaseArray(ref);
    },
    getById: function(med_id){
       console.log(med_id);
      return $firebaseObject(this.ref().child(med_id));
    },
    getByTradeName: function(trade_name) {
      // for (var i = 0; i < medications.length; i++) {
      //   if (medications[i].trade_name == trade_name)
      //     return medications[i]
      // }
      var ref = this.ref()
      var req = ref.orderByChild('trade_name').equalTo(trade_name).once("child_added");
      return req;
    }
  };
}])

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
      days: [false, true, true, true, false, false, true], //array descirbing days of week to do this action
      medications: ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
    },
    {
      time: "13:00",
      slot: "Afternoon",
      days: [true, false, true, false, true, true, true], //array descirbing days of week to do this action,
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
      var ref = this.ref().child("default")
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
      return Patient.ref(uid).child("medication_schedules")
    },

    /*
     * queries firebase data and returns the default from firebase
     * returns a $firebaseArray, this IS NOT A PROMISE. CANNOT CALL THE THEN METHOD ON this
     * use this to display the schedule on the view layer.
     */
    get: function() {
      var ref = this.ref().child("default");
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
    },
    lisinopril: {
      dose: 40,
      tablets: 3,
      required: false
    },
    warfarin: {
      dose: 500,
      tablets: 4,
      required: true
    },
    losartan: {
      dose: 40,
      tablets: 5,
      required: false
    },
    metoprolol: {
      dose: 40,
      tablets: 6,
      required: false
    },
    statin: {
      dose: 40,
      tablets: 7,
      required: false
    },
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
