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


.factory('MedicationScheduleFB', ["$firebaseArray", "$firebaseObject", function($firebaseArray, $firebaseObject) {
  return {
    get: function(username) {
      // create a reference to the database where we will store our data
      var ref = new Firebase("https://vivid-inferno-5187.firebaseio.com/users");
      var scheduleRef = ref.child(username).child('medicationSchedule');
      // return it as a synchronized Array
      return $firebaseArray(scheduleRef);
    },
    findByID: function(username, id) {
      // create a reference to the database where we will store our data
      var ref = new Firebase("https://vivid-inferno-5187.firebaseio.com/users");
      var ans = ref.child(username).child('medicationSchedule').child(0);
      // return it as a synchronized object
      return  $firebaseObject(ans);

      /*
      console.log(schedule);
      var dateSchedule;
      for (var i = 0; i < schedule.length; i++) {
        if (schedule[i].id == id)
          dateSchedule = schedule[i]
      }
      return dateSchedule;
      */
    }
  }

}])



// This factory is responsible for defining a Medication Schedule
// that the patient usually adheres to.
.factory('MedicationSchedule', ["Medication","Patient","$firebaseObject", "$firebaseArray", "$q", function(Medication, Patient, $firebaseObject,$firebaseArray, $q) {


  schedule = [
    {
      id: 0,
      time: "08:00",
      slot: "morning",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action
      medications: ["Lasix", "Toprol XL", "Zestril", "Coumadin", "Riomet"]
    },
    {
      id: 1,
      time: "13:00",
      slot: "afternoon",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action,
      medications: ["Lasix", "Toprol XL", "Zestril", "Riomet"]
    },
    {
      id: 2,
      time: "19:00",
      slot: "evening",
      days: [0,1,2,3,4,5,6], //array descirbing days of week to do this action,
      medications: ["Lipitor"]
    }
  ]


  return {

    addDefaultToFireBase() {
      var uid = Patient.uid();
      var ref = Patient.ref(uid).child("medicationSchedule");
      ref.set({defaultSchedule:schedule});
    },


    //Old get method
    get: function() {
      return schedule;
    },
    /*
    get: function() {
      var ref = this.ref().child("defaultSchedule");
      var deferred = $q.defer();
      req = $firebaseArray(ref)
      req.$loaded().then(function (val) {
        console.log()
        deferred.resolve(val)
      });
      return deferred.promise
      //return $firebaseArray(ref)
    },
    */
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("medicationSchedule")
    },

    testObject: function() {
      var ref = this.ref().child("defaultSchedule").child("0").child("slot");
      return $firebaseObject(ref);
    },

    testQuery: function() {
      var ref = this.ref().child("defaultSchedule").orderByChild("id").equalTo(1).once("child_added");
      return ref
      /*
      .on("child_added", function(snapshot) {
        //console.log(snapshot.val())
        $timeout(function() {
          $scope.test=snapshot.val()
        })
      })
      */
    },
    findByIdFB: function(id) {
      var ref = this.ref().child("defaultSchedule").orderByChild("id").equalTo(id).once("child_added");
      return ref;
    },
    findByID: function(id) {
      /*
      var uid = Patient.uid();
      var ref = this.ref(uid).child("defaultSchedule").child(id-1);
      //var ref = this.ref(uid).child("defaultSchedule");
      var deferred = $q.defer();
      //var req = ref.orderByChild("id").equalTo(id).once('value', function(snap) {
        //console.log(snap.val());
        //deferred.resolve(snap.val());
      //});
      //return deferred.promise
      req = $firebaseArray(ref);
      req.$loaded().then(function (val) {
        //console.log(val)
        deferred.resolve(val);
      });
      return deferred.promise
      */
      var schedule = this.get();
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

.factory('MedicationHistoryFB', ["$firebaseArray", "$firebaseObject", function($firebaseArray, $firebaseObject) {
  return {
    get: function(username) {
      // create a reference to the database where we will store our data
      var ref = new Firebase("https://vivid-inferno-5187.firebaseio.com/users");
      var historyRef = ref.child(username).child('medicationHistory');
      // return it as a synchronized Array
      return $firebaseArray(scheduleRef);
    },
  }

}])

.factory('MedicationHistory', ["Medication", function() {
  var count = 1;
  var history = [{
      id: 0,
      medication_id: 1,
      medication_schedule_id: 0,
      taken_at: "2016-03-15T08:01:00",
      skipped_at: null
    }, {
      id: 1,
      medication_id: 7,
      medication_schedule_id: 2,
      taken_at: null,
      skipped_at: "2016-03-21T19:00:00"
    }
  ]

  return {
    get: function() {
      return history;
    },

    create_or_update: function(username, medication, schedule, choice) {
      // create a reference to the database where we will store our data
      var ref = new Firebase("https://vivid-inferno-5187.firebaseio.com/patients");
      var historyRef = ref.child(username).child('medicationHistory');
      var instanceFB =  {
          id: history.length + 1,
          medication_id: medication.id,
          medication_schedule_id: schedule.id,
          date : (new Date()).toDateString()
      };
      var time_now = (new Date()).toTimeString();
      var updateObject;
      if (choice == "take") {
        instanceFB.taken_at = time_now;
        updateObject = {'taken_at':time_now};
      }
      else if (choice == "skip") {
        instanceFB.skipped_at = time_now;
        updateObject ={'skipped_at':time_now};
      }
      //query
      var query = historyRef.orderByChild('date').equalTo((new Date()).toDateString());
      //query callback
      query.once('value', function(snapshot) {
        if (snapshot.exists()) {
          var updated = false;
          console.log('exists');
          snapshot.forEach(function(data) {
            console.log("key: "+ data.key()+ " value: " + data.val().medication_schedule_id + " "+data.val().medication_id)
            var hist = data.val();
            if (hist.medication_schedule_id == schedule.id && hist.medication_id == medication.id) {
              //found it, need to update it!
              updated=true;
              var medRef = data.ref();
              medRef.update(updateObject);
            }
          });
          if(!updated) {
              //need to push a new one.
              var medRef = snapshot.ref();
              medRef.push(instanceFB);
          }
        }
        else {
          //doesnt exist at all yet, push a new one.
          //console.log("doesnt exist");
          var medRef = snapshot.ref();
          medRef.push(instanceFB);
        }
      }); //end query callback.

      /*---------------------------------------------------------------------
      non firebase way
      -----------------------------------------------------------------------*/
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
