angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();

  $scope.history = new Array();
  var ref = MedicationHistory.getTodaysRef();

  ref.on("child_added", function(snapshot) {
    var hist = snapshot.val()
    var med = Medication.getTradeName(hist.medication_id)
    if(typeof($scope.history[hist.medication_schedule_id])=='undefined')
      $scope.history[hist.medication_schedule_id] = new Array()
    if(typeof($scope.history[hist.medication_schedule_id].med)=='undefined')
      $scope.history[hist.medication_schedule_id][med] = new Object()
    if(hist.taken_at!=null)
      $scope.history[hist.medication_schedule_id][med].taken_at="yes"
    if(hist.skipped_at!=null)
      $scope.history[hist.medication_schedule_id][med].skipped_at="yes"

  })
  ref.on("child_changed", function(snapshot) {
    var hist = snapshot.val()
    var med = Medication.getTradeName(hist.medication_id)
    if(hist.taken_at!=null)
      $scope.history[hist.medication_schedule_id][med].taken_at="yes"
    if(hist.skipped_at!=null)
      $scope.history[hist.medication_schedule_id][med].skipped_at="yes"
  })

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

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Patient, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByTradeName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
  var scheudle_id = parseInt($stateParams.schedule_id);

  $scope.takeMedication = function() {
    var uid = Patient.uid();//JSON.parse(window.localStorage["authData"]).uid;
    MedicationHistory.create_or_update(uid, $scope.medication, scheudle_id, "take")
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
            var uid = Patient.uid();//JSON.parse(window.localStorage["authData"]).uid;
            //var uid = JSON.parse(window.localStorage["authData"]).uid;
            MedicationHistory.create_or_update(uid, $scope.medication, scheudle_id, "skip")
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


  $scope.saveMedicationSchedule = function() {

  };
   $scope.moveItem = function(slot, item, fromIndex, toIndex) {

  };

})
