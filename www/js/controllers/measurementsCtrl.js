angular.module('app.controllers', ['ionic', 'ionic-timepicker'])

.controller('addMeasurementScheduleCtrl', function($scope, MeasurementSchedule) {
    $scope.Scheduledmeasurements = MeasurementSchedule.getInputShedule();

})

.controller('MeasurementSetupCtrl', function($scope, MeasurementSchedule, ionicTimePicker ) {
  var ipObj1 = {
      callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          var selectedTime = new Date(val * 1000);
          console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
        }
      },
      inputTime: 50400,   //Optional
      format: 12,         //Optional
      step: 15,           //Optional
      setLabel: 'Set2'    //Optional
    };

    ionicTimePicker.openTimePicker(ipObj1);
})


.controller('measurementsCtrl', function($scope, Measurement) {
  // We inject the Measurement factory so that we can query for the measurement
  // history.
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
