angular.module('app.controllers', [])
.controller('appCtrl', function($scope, Patient) {
  $scope.patient = Patient.get()

  $scope.logout = function() {
    Patient.logout()
  };
})
