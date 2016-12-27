angular.module('app.controllers')

.controller('settingsCtrl', function($scope, Patient, $state, $ionicHistory) {
  // $scope.logout = function() {
  //   Patient.logout();
  //   $ionicHistory.clearCache(); //so current login does not interfere with next login
  //   $ionicHistory.nextViewOptions({
  //     disableAnimate: true,
  //     disableBack: true,
  //     historyRoot: true
  //   })
  //   $state.go("login");
  // }
  $scope.logout = function() {
    Patient.logout()
  };
})
