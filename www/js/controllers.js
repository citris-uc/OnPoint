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

.controller('addMeasurementsCtrl', function($scope, $state, Measurement,$ionicPopup, $ionicHistory) {

  // We inject the Measurement factory so that we can query for the measurement
  // history.

  //Need to bind the ng-model to an object, thats why i declare newMeasurement={}
  $scope.newMeasurement = {};
  $scope.newMeasurement.weight = null;
  $scope.newMeasurement.systolic = null;
  $scope.newMeasurement.diastolic = null;
  $scope.newMeasurement.heartRate = null;
  $scope.newMeasurement.bpcolor = 'black';
  $scope.measurements = Measurement.get();

  $scope.addMeasurement = function() {
    Measurement.add(new Date(),
                    $scope.newMeasurement.weight,
                    $scope.newMeasurement.systolic,
                    $scope.newMeasurement.diastolic,
                    $scope.newMeasurement.heartRate);
    $state.go('tabsController.measurements');
    //$ionicHistory.goBack(); //calling back button manually.
  };
  $scope.disableDone = function() {
    
    if ($scope.newMeasurement.weight!=null || $scope.newMeasurement.heartRate!=null
        || $scope.newMeasurement.systolic!=null || $scope.newMeasurement.diastolic!=null) {
       console.log("DONE");
       return false;
    } else {
       console.log("NOT DONE");
       return true;
    }
    
    
  };

  $scope.checkBP = function() {
    if ($scope.newMeasurement.systolic!=null && $scope.newMeasurement.diastolic!=null) {
      if ($scope.newMeasurement.systolic >160) { //hardcoded limits for now
        $scope.newMeasurement.bpcolor = 'red';
        $scope.bpAlert('Blood Pressure High'); 
      } else if ($scope.newMeasurement.systolic < 90){
        $scope.newMeasurement.bpcolor = 'red';
        $scope.bpAlert('Blood Pressure Low'); 
      }
    } 
  };
  
$scope.bpAlert = function(value) {
  $scope.data = {};

  var myPopup = $ionicPopup.show({
    title: value,
    subTitle: 'Try taking another measurement in one minute. To ensure a good reading, please follow the tips.',
    scope: $scope,
    buttons: [
      { text: 'View Tips',
        onTap: function(e) {
          $state.go('tabsController.measurementTips');
        }  
      },
      {
        text: '<b>OK</b>'
        //,type: 'button-positive',
      }
    ]
  });

  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });
 };
/*
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
 }; */
})

.controller('measurementTipsCtrl', function($scope, MeasurementTips) {
  // We inject the Measurement Tips factory so that we view tips
  $scope.measurementsTips = MeasurementTips.get();
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


