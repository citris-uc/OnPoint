angular.module('app.services')

.factory('Medication',["Patient","$firebaseObject", "$firebaseArray", "$http", "$q", function(Patient, $firebaseObject,$firebaseArray, $http, $q) {
  /*
   * These are default medcations set/instructions for testing purposes
   * TODO: delete id field
   * TODO: (much later) delete this.
   */



  medications = [
    {id: 1, name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure.", dose: 40, tablets: 1, required: false, img:"lasix.png"},
    {id: 2, name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure.", dose: 500, tablets: 2, required: true, img:"toprol.png"},
    {id: 3, name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure.", dose: 40, tablets: 3, required: false, img:"zestril.png"},
    {id: 4, name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner.", dose: 500, tablets: 4, required: true, img:"coumadin.png"},
    {id: 5, name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure.", dose: 40, tablets: 5, required: false, img:"cozaar.png"},
    {id: 6, name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes.", dose: 40, tablets: 6, required: false, img:"riomet.png"},
    {id: 7, name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels.", dose: 40, tablets: 7, required: false, img:"lipitor.png"}
  ]
  var defaultMeds = [
    {id: 1, name: "furomeside", trade_name: "Lasix", instructions: "Take twice daily; First in morning and then 6-8 hours later", purpose: "Treats salt and fluid retention and swelling caused by heart failure.", dose: 40, tablets: 1, required: false, img:"lasix.png"},
    {id: 2, name: "metoprolol", trade_name: "Toprol XL", instructions: "TODO: Add instructions here", purpose: "Used to treat chest pain (angina), heart failure, and high blood pressure.", dose: 500, tablets: 2, required: true, img:"toprol.png"},
    {id: 3, name: "lisinopril", trade_name: "Zestril", instructions: "TODO: Add instructions here", purpose: "Zestril is used to treat high blood pressure (hypertension) or congestive heart failure.", dose: 40, tablets: 3, required: false, img:"zestril.png"},
    {id: 4, name: "warfarin", trade_name: "Coumadin", instructions: "Take orally once a day in the morning", purpose: "Treats and prevents blood clots by acting as a blood thinner.", dose: 500, tablets: 4, required: true, img:"coumadin.png"},
    {id: 5, name: "losartan", trade_name: "Cozaar", instructions: "TODO: Add instructions here", purpose: "It can treat high blood pressure.", dose: 40, tablets: 5, required: false, img:"cozaar.png"},
    {id: 6, name: "metformin", trade_name: "Riomet", instructions: "Take orally, twice daily, with meals", purpose: "Used to treat Type 2 Diabetes.", dose: 40, tablets: 6, required: false, img:"riomet.png"},
    {id: 7, name: "statin", trade_name: "Lipitor", instructions: "TODO: Add instructions here", purpose: "It can treat high cholesterol and triglyceride levels.", dose: 40, tablets: 7, required: false, img:"lipitor.png"}
  ]
  input_medications = [];

  return {
    units: [
      {value: "mg", display: "mg"},
      {value: "ml", display: "ml"},
      {value: "micrograms", display: "micrograms"},
      {value: "tablets", display: "tablets"},
      {value: "capsules", display: "capsules"},
      {value: "spray", display: "spray"},
      {value: "inhalation", display: "inhalation"}
    ],
    search: function(query) {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "drugs?query=" + query,
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    ocr: function(base64_photo) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url: onpoint.env.serverURL + "images/parse_from_mobile",
          data: {
            base64_photo: base64_photo
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },

    searchByRXCUI: function(rxcui) {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "drugs/rxcui?rxcui=" + rxcui,
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      }).catch(console.log.bind(console));
    },

    add: function(medication) {
      uid = null
      return Patient.get().then(function(p) {
        uid = p.uid
        return Patient.ref(uid).child("medications").once("value")
      }).then(function(meds) {
        medications = meds.val() || []
        should_update = true
        console.log("List of meds: ")
        console.log(medications)
        for (var i=0; i < medications.length; i++) {
          console.log(medications[i])
          if (meds[i].name == medication.name)
            should_update = false
        }

        console.log("Should update: ")
        console.log(should_update)
        console.log(uid)
        console.log(medication)

        // .set() doesn't allow undefined values so we need to clear them out.
        for (var key in medication) {
          if (!medication[key])
            medication[key] = ""
        }

        if (should_update) {
          ref = Patient.ref(uid).child("medications")
          newMessageRef = ref.push();
          return newMessageRef.set(medication);
        } else {
          return Patient.ref(uid).child("medications")
        }
      })
    },




    // Old methods...
    //-------------------------------------------------------------------------

    findMedicationByName: function(name, list) {
      for(var i = 0; i < list.length; i++) {
        if (list[i].trade_name == name) {
          return list[i]
        }
      }
      return null
    },

    getDefaultMedications: function() {
      return medications;
    },

    setDefaultMeds: function() {
      return Patient.get().then(function(p) {
        ref = Patient.ref(p.uid).child("medications")
        return $q.all( defaultMeds.map(function(row) { return ref.push(row)}) )
      }).catch(console.log.bind(console));
    },

    cabRef: function(){
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("cabinet_medications")
      })
    },
    saveCabMed: function(newCabMed) {
      this.cabRef().push(newCabMed)
    },

    get: function() {
      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("medications")).$loaded()
      })
    },
    getCabMeds: function(){
      var ref = this.cabRef();
      return $firebaseArray(ref);
    },
    getById: function(med_id){
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("medications").child(med_id));
      })
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
