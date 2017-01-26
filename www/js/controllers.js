angular.module('app.controllers', [])
.controller('appCtrl', function($scope, Patient) {
  $scope.logout = function() {
    Patient.logout()
  };
})
