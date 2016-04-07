angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule           = MedicationSchedule.get();
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();

  $scope.didTakeMed = function(medication, schedule) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(medication, schedule) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }
})

.controller("medicationScheduleCtrl", function($scope, $stateParams, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);

  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();

  $scope.didTakeMed = function(medication) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(medication) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }
})

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByTradeName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
    req.then(function(ref) {
      var alertPopup = $ionicPopup.alert({
        title: 'Success',
        template: 'You have succesfully taken ' + $scope.medication.trade_name
      });

      alertPopup.then(function(res) {
        $ionicHistory.goBack();
      });
    })
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
            var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "skip");
            req.then(function(ref) { $ionicHistory.goBack();});          }
        }
      ]
    });
  };
})

.controller('medicationsSettingCtrl', function($scope, $ionicPopup, Patient, Medication, MedicationScheduleOLD, MedicationHistory) {

  // TODO --> use MedicationSchedule and FB
  $scope.schedule = MedicationScheduleOLD.get();
  $scope.selected_med = null;
  $scope.newSlotName = {text: ""};
  $scope.showError = false;
  $scope.addTimeSlot = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'medSched-popup-template.html',
      title: 'Add a time slot',
      subTitle: 'Enter new time slot name',
      attr:'data-ng-disabled=""!newSlotName.text"',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          onTap: function(e) {
            if ($scope.newSlotName.text) {
              MedicationScheduleOLD.addTimeSlot($scope.newSlotName.text, [0,1,2,3,4,5,6]);
              $scope.newSlotName.text = "";
              $scope.showError = false;
            } else {
              e.preventDefault();
              $scope.showError = true;

            }
          }
        }
      ]
    });
  }
  //var uid = JSON.parse(window.localStorage["authData"]).uid;

  //3 way data binding of medicationSchedule...
  //MedicationScheduleFB(uid).$bindTo($scope,"schedule");

  // $scope.schedule = MedicationScheduleFB(uid);
  // console.log(schedule);
  // $scope.saveMedicationSchedule = function() {
  //   var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
  //   console.log(JSON.parse(window.localStorage["authData"]).uid);
  //   var userRef = firebaseRef.child("users").child(JSON.parse(window.localStorage["authData"]).uid);
  //
  //   console.log(schedule);
  //
  // };
   //$scope.moveItem = function(slot, item, fromIndex, toIndex) {
    //console.log("Move from: " + fromIndex + " to: " + toIndex + " Med: " + item);
    //Move the item in the array
    //slot.medications.splice(fromIndex, 1);
    //slot.medications.splice(toIndex, 0, item);
  //};
})
