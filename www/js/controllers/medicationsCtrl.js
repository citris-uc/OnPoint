angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();

  $scope.medicationHistory = function(med_name, schedule_id) {
    med = Medication.getByTradeName(med_name)
    return MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule_id)
  }
})

.controller("medicationScheduleCtrl", function($scope, $stateParams, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);

  $scope.medicationHistory = function(med_name) {
    med = Medication.getByTradeName(med_name)
    return MedicationHistory.findByMedicationIdAndScheduleId(med.id, $scope.schedule.id)
  }
})

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByTradeName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    var uid = JSON.parse(window.localStorage["authData"]).uid;
    MedicationHistory.create_or_update(uid, $scope.medication, $scope.schedule, "take")
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'You have succesfully taken ' + $scope.medication.trade_name
    });

    alertPopup.then(function(res) {
      $ionicHistory.goBack();
    });
  }

  $scope.skipMedication = function()  {
    var myPopup = $ionicPopup.show({
      subTitle: 'Are you sure you want to skip ' + $scope.medication.trade_name,
      scope: $scope,
      buttons: [
        { text: 'No' },
        {
          text: '<b>Yes</b>',
          onTap: function(e) {
            var uid = JSON.parse(window.localStorage["authData"]).uid;
            MedicationHistory.create_or_update(uid, $scope.medication, $scope.schedule, "skip")
            $ionicHistory.goBack();
          }
        }
      ]
    });
  };
})

.controller('medicationsSettingCtrl', function($scope, MedicationScheduleFB, Medication, MedicationSchedule, MedicationHistory, Patient) {
  //$scope.schedule = MedicationSchedule.get();
  var uid = Patient.uid();


  //3 way data binding of medicationSchedule...
  //MedicationScheduleFB(uid).$bindTo($scope,"schedule");

  $scope.schedule = MedicationScheduleFB.get(uid);

  console.log(schedule);
  $scope.saveMedicationSchedule = function() {
    var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
    console.log(JSON.parse(window.localStorage["authData"]).uid);
    var userRef = firebaseRef.child("users").child(JSON.parse(window.localStorage["authData"]).uid);
    var temp = MedicationScheduleFB.findByID(uid,1);
    console.log(temp); //gets an object
    console.log(temp.$id); //can access perfectly fine
    console.log(temp.days); // this is 'undefined' bc of asynchrnous behavior
    temp.$loaded(
       function(data) {
        console.log(data.days);  //this works great
      });
    $scope.schedule.$loaded(
      function(data) {
        console.log(data.$getRecord(0)); //this also works
      },
      function(error) {
        console.error("Error:", error);
      }
    );

  };
   $scope.moveItem = function(slot, item, fromIndex, toIndex) {
    console.log(fromIndex);
    console.log(toIndex);
    console.log(slot.medications);
    //Move the item in the array
    slot.medications.splice(fromIndex, 1);
    slot.medications.splice(toIndex, 0, item);
  };
})
