angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {

})

.controller('measurementsCtrl', function($scope, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.measurements = Measurement.get();
})

.controller('appointmentsCtrl', function($scope) {

})

.controller('goalsCtrl', function($scope, Goal) {
  // We inject the Goal factory so that we can query for the personal
  // goals associated with the user.
  $scope.personal_goals = Goal.get();
})

.controller('addGoalCtrl', function($scope) {

})

.controller('appointmentCtrl', function($scope) {

})

.controller('symptomsSliderCtrl', function($scope) {

})

.controller('symptomsListCtrl', function($scope) {

})

.controller('symptomsListMultipleCtrl', function($scope) {

})

.controller('measurementTipsCtrl', function($scope) {

})
