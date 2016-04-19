angular.module('app.controllers')

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
