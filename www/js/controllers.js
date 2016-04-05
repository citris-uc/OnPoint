angular.module('app.controllers', [])
.controller('goalsCtrl', function($scope, Goal) {
  // TODO use enums for personal/clinical here
  $scope.goals = Goal.get();

  // See https://github.com/angular/angular.js/wiki/Understanding-Scopes
  // on why we're creating an Object here rather than assigning
  // a scope variable to a primitive boolean.
  $scope.visible = {personal: false, clinical: false}

  $scope.addGoal = function(goal) {
    Goal.add(goal);
  }
})

.controller('symptomsSliderCtrl', function($scope) {

})

.controller('symptomsListCtrl', function($scope) {

})

.controller('symptomsListMultipleCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope, Patient, $state, $ionicHistory) {
  $scope.logout = function() {
    Patient.logout();
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
    $state.go("loginScreen");
  }
})
