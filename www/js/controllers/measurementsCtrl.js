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
       if($scope.newShedule.heart_rate == true){
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

.controller('measurementsCtrl', function($scope, $ionicSlideBoxDelegate,Measurement, MeasurementSchedule) {
  $scope.measurementTab = {pageIndex: 0}
  $scope.history = Measurement.get();
  $scope.schedule = MeasurementSchedule.get();
  $scope.newMeasurement = {};
  $scope.schedule.$loaded().then(function() {
    console.log($scope.schedule)
  })


  $scope.slideHasChanged = function(pageIndex) {
    $scope.measurementTab.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $scope.measurementTab.pageIndex = pageIndex;
    $ionicSlideBoxDelegate.slide(pageIndex);
  }

  $scope.saveMeasurement = function(schedule) {
    var measurement;

    if(schedule=='custom') {
      schedule = {$id: 'custom'}
      measurement = $scope.newMeasurement['custom']
    }
    else {
      meausrement = $scope.newMeasurement[schedule.$id]
    }

    Measurement.add(measurement, schedule);
  };

  $scope.disableSave = function(schedule_id) {
    if($scope.newMeasurement.hasOwnProperty(schedule_id)) {
      if(Object.keys($scope.newMeasurement[schedule_id]).length > 0) {
        return false;
      }
    }
    else
      return true;
  };

})

.controller('addMeasurementsCtrl', function($scope, $state, $stateParams, Measurement, MeasurementSchedule, $ionicPopup, $ionicHistory) {
  $scope.schedule = MeasurementSchedule.findByID($stateParams.schedule_id);
  $scope.newMeasurement = {};

  $scope.addMeasurement = function() {
    Measurement.add($scope.newMeasurement, $scope.schedule);
    if($ionicHistory.backView()==null)
      $state.go('tabsController.timeline') //by default go to timeline
    else
      $state.go($ionicHistory.backView().stateName);
  };

  $scope.disableDone = function() {
    if(Object.keys($scope.newMeasurement).length > 0)
      return false;
    else
      return true;
  };
})

.controller('enterMeasurementsCtrl', function($scope, $state, $stateParams, Measurement, MeasurementSchedule, $ionicPopup, $ionicHistory) {
  $scope.measurementHistory = Measurement.getTodaysHistory();
  var bpcolor = 'black'

  $scope.setColor = function(measurement_name) {
    if(measurement_name.includes('blood pressure')) {
      return bpcolor;
    }
    return 'black';
  };

  $scope.didTakeMeasurement = function(measurement_name) {
    for(var i = 0; i < $scope.measurementHistory.length; i++) {
      var measurements = $scope.measurementHistory[i].measurements;
        if(typeof(measurements[measurement_name]) != 'undefined') {
          return true
        }
    }
    return false
  };

  $scope.getMeasurementValue = function(measurement_name) {
    for(var i = 0; i < $scope.measurementHistory.length; i++) {
      var measurements = $scope.measurementHistory[i].measurements;
        if(typeof(measurements[measurement_name]) != 'undefined') {
          return measurements[measurement_name]
        }
    }
    return false
  };

  $scope.check = function(measurement_name, schedule_id) {
    //Can come in with specific scheudle_id or not, need to check.
    //can come frmo timline card(no specific schedule_id) or measurements tab(specific schedule_id)
    var newMeasurement = typeof(schedule_id) =='undefined'? $scope.newMeasurement:$scope.newMeasurement[schedule_id]
    if(measurement_name.includes('blood pressure')) {
      if(Measurement.hasHighBP(newMeasurement)) {
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
