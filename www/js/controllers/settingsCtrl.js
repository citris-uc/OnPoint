angular.module('app.controllers')

.controller('settingsCtrl', function($scope, Patient, $state, $ionicHistory) {
  $scope.logout = function() {
    Patient.logout();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
    $state.go("login");
  }
})
