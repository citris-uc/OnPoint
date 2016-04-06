angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();

  $scope.medicationHistory = function(med_name, schedule_id) {
    med = Medication.getByName(med_name)
    return MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule_id)
  }
})

.controller("medicationScheduleCtrl", function($scope, $stateParams, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);

  $scope.medicationHistory = function(med_name) {
    med = Medication.getByName(med_name)
    return MedicationHistory.findByMedicationIdAndScheduleId(med.id, $scope.schedule.id)
  }
})

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take")
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
            MedicationHistory.create_or_update($scope.medication, $scope.schedule, "skip")
            $ionicHistory.goBack();
          }
        }
      ]
    });
  };
})

.controller('medicationsSettingCtrl', function($scope, Patient, MedicationScheduleFB, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();
  $scope.selected_med = null;

  var uid = Patient.uid;



  // angular.forEach($scope.schedule, function(value, key) {
  //   this.push(value.slot)
  //   console.log("slot: "+ value.slot + " medications: " + value.medications);
  //   value.medications.forEach(function(med) {
  //     $scope.medlist.push(med.trade_name);
  //   });
  // }, $scope.medlist);
  //
  // console.log("MedList: " + $scope.medlist);
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
