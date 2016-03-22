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
