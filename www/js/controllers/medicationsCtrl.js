angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, MedicationSchedule) {
  $scope.schedule = MedicationSchedule.get();
})
.controller("medicationScheduleCtrl", function($scope, $stateParams, MedicationSchedule, MedicationDosage) {
  $scope.state = $stateParams
  $scope.schedule = MedicationSchedule.get()[$scope.state.schedule];
})
.controller("medicationCtrl", function($scope, $stateParams, Medication, MedicationSchedule, MedicationDosage) {
  $scope.medication = Medication.getByName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
})
