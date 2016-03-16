angular.module('app.controllers', [])

.controller('loginCtrl', function($scope) {

})

.controller('measurementsCtrl', function($scope, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
  $scope.measurements = Measurement.get();
})

.controller('addMeasurementsCtrl', function($scope, Measurement,$ionicPopup) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.

  //Need to bind the ng-model to an object, thats why i declare input={}
  $scope.input = {};
  $scope.input.systolic = null;
  $scope.input.diastolic = null;
  $scope.input.bpcolor = 'black';
  $scope.measurements = Measurement.get();
  $scope.checkBP = function() {
    if ($scope.input.systolic!=null && $scope.input.diastolic!=null) {
      if ($scope.input.systolic >160) { //hardcoded limits for now
        $scope.input.bpcolor = 'red';
        $scope.bpAlert('Blood Pressure High'); 
      } else if ($scope.input.systolic < 90){
        $scope.input.bpcolor = 'red';
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
      { text: 'View Tips' },
      {
        text: '<b>OK</b>',
        //type: 'button-positive',
        /*
        onTap: function(e) {
          if (!$scope.data.wifi) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.wifi;
          }
        } */
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
