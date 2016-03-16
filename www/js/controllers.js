angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {
})

.controller('timelineCtrl', function($scope) {
})

.controller('measurementsCtrl', function($scope, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.measurements = Measurement.get();
})

.controller('medicationsCtrl', function($scope) {
})

.controller('addMeasurementsCtrl', function($scope, Measurement) {
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

.controller('appointmentCtrl', function($scope, Appointment) {

  var appointmentRecord = Appointment.get();
  var eventDates = []

  for(var i = 0; i < appointmentRecord.length; i++){
    var oneEventDay = new Date(appointmentRecord[i].timestamp);
    eventDates.push(oneEventDay.getDate());
  }

  $scope.isEventDay = function(day){
    return (eventDates.indexOf(parseInt(day)) > -1);
  }

	var oDate = new Date();
  $scope.curDate = oDate;
  $scope.today = oDate.getDate();

  var firstDate = new Date();
  firstDate.setDate(1);
  var totalDays = new Date(oDate.getFullYear(),       oDate.getMonth() + 1, 0).getDate();
  $scope.weeks = [];

  var numWeeks = totalDays/7;
  var day = 1;
  for(var i = 0; i < numWeeks; i++){
    $scope.weeks[i] = [];
    for(var j = 0; j < 7; j++){
       if(i == 0 && j < firstDate.getDay()){
          $scope.weeks[i].push("");
       }else{
          if(day <= totalDays){
              $scope.weeks[i].push(day.toString());
          }else{
              $scope.weeks[i].push("");
          }
          day++;
       }
    }
  }
})

.controller('symptomsSliderCtrl', function($scope) {

})

.controller('symptomsListCtrl', function($scope) {

})

.controller('symptomsListMultipleCtrl', function($scope) {

})

.controller('measurementTipsCtrl', function($scope) {

})
