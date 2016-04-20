angular.module('app.controllers')

//TODO: Clean this up...very ugly use ng repeat in the new_measurement_schedule.html
.controller('measurementScheduleCtrl', function($scope, $ionicPopup, $state,Patient, MeasurementSchedule) {
  $scope.measurement_schedule = MeasurementSchedule.get();
  $scope.newShedule = {time: new Date("2016-01-01 08:00")};

  var displayAlert = function(message) {
    var myPopup = $ionicPopup.show({
      title: "Measurements missing",
      subTitle: message,
      scope: $scope,
      buttons: [{text: 'OK'}]
    });
  }

  $scope.save = function(){
    if (!$scope.newShedule.name)
      displayAlert("Please enter a measurement name");
    else if( !$scope.newShedule.weight && !$scope.newShedule.blood_pressure && !$scope.newShedule.heart_rate ){
      displayAlert("Please choose a measurement");
    } else if( (typeof $scope.newShedule.days0 === 'undefined') && (typeof $scope.newShedule.days1 === 'undefined')
      && (typeof $scope.newShedule.days2 === 'undefined') && (typeof $scope.newShedule.days3 === 'undefined')
      && (typeof $scope.newShedule.days4 === 'undefined') && (typeof $scope.newShedule.days5 === 'undefined')
      && (typeof $scope.newShedule.days6 === 'undefined')) {
        displayAlert("Please select a reminder day");
    } else{
       var schedule = {};
       schedule.name   = $scope.newShedule.name;
       schedule.hour   = $scope.newShedule.time.getHours();
       schedule.minute = $scope.newShedule.time.getMinutes();
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
         schedule.measurements.push({'name':'weight','unit':'lbs'});
       }
       if($scope.newShedule.blood_pressure == true){
         schedule.measurements.push({'name':'systolic blood pressure','unit':'mmHg'});
         schedule.measurements.push({'name':'diastolic blood pressure','unit':'mmHg'});
       }
       if($scope.newShedule.heartRate == true){
         schedule.measurements.push({'name':'heart rate','unit':'bpm'});
       }
       MeasurementSchedule.add(schedule);
       $state.go('carePlan.measurementSchedules');
    }
  }
  //Done onboarding!
  var ref = Patient.ref();
  var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})

})

.controller('measurementsCtrl', function($scope, Measurement, MeasurementSchedule) {
  $scope.measurements = Measurement.get();
  $scope.schedule = MeasurementSchedule.get();
})

.controller('addMeasurementsCtrl', function($scope, $state, $stateParams, Measurement, MeasurementSchedule, $ionicPopup, $ionicHistory) {
  $scope.newMeasurement = {};
  $scope.schedule = MeasurementSchedule.findByID($stateParams.schedule_id);
  var bpcolor = 'black'
  $scope.schedule.$loaded().then(function() {
    console.log($scope.schedule)
  })
  $scope.addMeasurement = function() {
    Measurement.add($scope.newMeasurement, $stateParams.schedule_id);
    //$ionicHistory.goBack(); // go back to wherever we came from, could be timeline could be measurements tab
    $state.go($ionicHistory.backView().stateName);
  };
  $scope.setColor = function(measurement_name) {
    if(measurement_name.includes('blood pressure')) {
      return bpcolor;
    }
    return 'black';
  };
  $scope.disableDone = function() {
    if ($scope.newMeasurement.weight!=null || $scope.newMeasurement.heartRate!=null || $scope.newMeasurement.systolic!=null || $scope.newMeasurement.diastolic!=null)
      return false;
    else
      return true;
  };

  $scope.check = function(measurement_name) {
    if(measurement_name.includes('blood pressure')) {
      if(Measurement.hasHighBP($scope.newMeasurement)) {
        bpcolor = 'red';
        $scope.bpAlert('Blood Pressure High');
      } else {
        bpcolor = 'black';
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
      {
        text: 'View Tips',
        //TODO: go to tabsController.measurementTips if came to the tips screen from measurements tab
        onTap: function(e) { $state.go('tabsController.measurementActionTips'); }
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

.controller('measurementViewCtrl', function($scope, $stateParams, MeasurementSchedule) {
   $scope.schedule = MeasurementSchedule.findByID($stateParams.measuremnt_schedule_id);
})
