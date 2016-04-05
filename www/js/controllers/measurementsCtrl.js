angular.module('app.controllers', ['ionic', 'ionic-timepicker'])

.controller('addMeasurementScheduleCtrl', function($scope, $state, $ionicPopup, MeasurementSchedule, ionicTimePicker ) {

    $scope.newShedule = {};
    $scope.remindTime = "You have not set the reminding time.";
    $scope.openTimer = function(){
      var ipObj1 = {
          callback: function (val) {      //Mandatory
            if (typeof (val) === 'undefined') {
              console.log('Time not selected');
            } else {
              var selectedTime = new Date(val * 1000);
              $scope.newShedule.time = selectedTime.getUTCHours()+":"+selectedTime.getUTCMinutes();
              $scope.remindTime = "You have selected the remind time as : " + $scope.newShedule.time;
              console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
            }
          },
          inputTime: 50400,   //Optional
          format: 12,         //Optional
          step: 15,           //Optional
          setLabel: 'Set2'    //Optional
      };
      ionicTimePicker.openTimePicker(ipObj1);
    };
    $scope.save = function(){
      var message = "";
      if( typeof $scope.newShedule.name === 'undefined'){
        message += "Please enter measurement name <br/>";
      }
      if( (typeof $scope.newShedule.weight === 'undefined') && (typeof $scope.newShedule.systolicBP === 'undefined')
          && (typeof $scope.newShedule.diastolicBP === 'undefined') && (typeof $scope.newShedule.heartRate === 'undefined')){
          message += " Please choose a measurement <br/>";
      }
      if( (typeof $scope.newShedule.days0 === 'undefined') && (typeof $scope.newShedule.days1 === 'undefined')
          && (typeof $scope.newShedule.days2 === 'undefined') && (typeof $scope.newShedule.days3 === 'undefined')
          && (typeof $scope.newShedule.days4 === 'undefined') && (typeof $scope.newShedule.days5 === 'undefined')
          && (typeof $scope.newShedule.days6 === 'undefined')){
          message += " Please select a reminder day <br/>";
      }
      if( typeof $scope.newShedule.time === 'undefined'){
        message += "Please select a reminder time <br/>";
      }

      if(message != ""){
        var myPopup = $ionicPopup.show({
          title: "Invalid input",
          subTitle: message,
          scope: $scope,
          buttons: [
            {text: '<b>OK</b>'}
          ]
        });
      }else{
         var schedule = {};
         schedule.name = $scope.newShedule.name;
         schedule.time = $scope.newShedule.time;
         schedule.days = [];
         if($scope.newShedule.days0 == true){
           schedule.days.push(0);
         }
         if($scope.newShedule.days1 == true){
           schedule.days.push(1);
         }
         if($scope.newShedule.days2 == true){
           schedule.days.push(2);
         }
         if($scope.newShedule.days3 == true){
           schedule.days.push(3);
         }
         if($scope.newShedule.days4 == true){
           schedule.days.push(4);
         }
         if($scope.newShedule.days5 == true){
           schedule.days.push(5);
         }
         if($scope.newShedule.days6 == true){
           schedule.days.push(6);
         }
         schedule.measurements = [];
         if($scope.newShedule.weight == true){
           schedule.measurements.push("weight");
         }
         if($scope.newShedule.systolicBP == true){
           schedule.measurements.push("systolicBP");
         }
         if($scope.newShedule.diastolicBP == true){
           schedule.measurements.push("diastolicBP");
         }
         if($scope.newShedule.heartRate == true){
           schedule.measurements.push("heartRate");
         }
         schedule.time = $scope.newShedule.time;
         MeasurementSchedule.add_inputSchedule(schedule);
         $state.go('measurementList');
      }
    }
})

.controller('measurementScheduleListCtrl', function($scope, MeasurementSchedule) {
  $scope.Scheduledmeasurements = MeasurementSchedule.get_inputSchedule();
})

.controller('measurementsCtrl', function($scope, Measurement) {
  $scope.measurements = Measurement.get();
})

.controller('addMeasurementsCtrl', function($scope, $state, Measurement, $ionicPopup, $ionicHistory) {
  $scope.newMeasurement = {};
  $scope.newMeasurement.bpcolor = 'black';

  $scope.addMeasurement = function() {
    Measurement.add($scope.newMeasurement);
    $state.go('tabsController.measurements');
  };

  $scope.disableDone = function() {
    if ($scope.newMeasurement.weight!=null || $scope.newMeasurement.heartRate!=null || $scope.newMeasurement.systolic!=null || $scope.newMeasurement.diastolic!=null)
      return false;
    else
      return true;
  };

  $scope.checkBP = function() {
    if (Measurement.hasHighBP($scope.newMeasurement)) {
      $scope.newMeasurement.bpcolor = 'red';
      $scope.bpAlert('Blood Pressure High');
    }
  };

$scope.bpAlert = function(value) {
  $scope.data = {};

  var myPopup = $ionicPopup.show({
    title: value,
    subTitle: 'Try taking another measurement in one minute. To ensure a good reading, please follow the tips.',
    scope: $scope,
    buttons: [
      {
        text: 'View Tips',
        onTap: function(e) { $state.go('tabsController.measurementTips'); }
      },
      {text: '<b>OK</b>'}
    ]
  });
 };
})

.controller('measurementTipsCtrl', function($scope, TIPS) {
  // We inject the Measurement Tips factory so that we view tips
  $scope.measurementsTips = TIPS;
})
