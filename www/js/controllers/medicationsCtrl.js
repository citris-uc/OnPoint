angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, MedicationSchedule) {
  $scope.schedule = MedicationSchedule.get();
})
.controller("medicationScheduleCtrl", function($scope, $stateParams, MedicationSchedule, MedicationDosage) {
  $scope.state = $stateParams

  $scope.schedule = MedicationSchedule.get()[$scope.state.schedule];
})
