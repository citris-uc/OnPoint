angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {

})

.controller('measurementsCtrl', function($scope,$location, $state, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.add = function() {
  	$state.go('tabsController.measurementAdd');
  };
 
  $scope.measurements = Measurement.get();

})

.controller('addMeasurementsCtrl', function($scope, Measurement,$ionicPopup) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.measurements = Measurement.get();
  
   $scope.bpAlert = function() {
   var bpAlert = $ionicPopup.confirm({
     title: 'Blood Pressure',
     template: 'yolo'
   });

   bpAlert.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
 };
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
