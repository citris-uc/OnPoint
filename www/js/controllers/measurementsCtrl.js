angular.module('app.controllers')

.controller('measurementsCtrl', function($scope, $state, Measurement, $ionicLoading, $ionicModal) {
  $scope.measurements = {}
  $scope.measurement  = {}
  $scope.state        = {}

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Measurement.getAll().then(function(doc) {
      console.log(doc)
      console.log("Measurement#getAll()")
      $scope.measurements = doc
      $scope.$broadcast('scroll.refreshComplete');
    }).then(function() {
      return Measurement.getSchedule()
    }).then(function(slot) {
      if (slot && slot.time)
        slot.time = moment(slot.time, "HH:mm").toDate()
      if (slot)
        $scope.slot = slot
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh();
  });

  $scope.save = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    if (!$scope.measurement.glucose && !$scope.measurement.weight && !$scope.measurement.heart_rate && !$scope.measurement.systolic && !$scope.measurement.diastolic) {
      navigator.notification.alert("You need to enter at least one measurement", null)
      $ionicLoading.hide()
      return
    }

    Measurement.add($scope.measurement).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $scope.measurement = {}
      $ionicLoading.hide()
    })
  };

  $scope.update = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    Measurement.update($scope.measurement).then(function(m) {
      return $scope.closeModal()
    }).catch(function(res) {
      $scope.$emit(onpoint.error, res)
    }).finally(function() {
      $scope.measurement = {}
      $ionicLoading.hide()
    })
  };

  $scope.destroy = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Deleting...", hideOnStateChange: true})

    Measurement.destroy($scope.state.appointment_date, $scope.state.appointment_id).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $scope.measurement = {}
      $ionicLoading.hide()
    })
  };

  $scope.showModal = function() {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/measurements/new.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show()
    });
  }

  $scope.showEditModal = function(measurement_id) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/measurements/edit.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      matching_measurement = _.find($scope.measurements, function(m) { return m.$id == measurement_id})
      $scope.measurement   = matching_measurement
      $scope.modal = modal;
      modal.show()
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.state = {};
  }
})



.controller('measurementsSchedulerCtrl', function($scope, $state, Measurement, $ionicLoading, $ionicModal) {
  $scope.reminders = []
  $scope.days      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  $scope.slot      = { days: [false, false, false, false, false, false, false] };

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Measurement.getSchedule().then(function(schedules) {
      $scope.reminders = schedules
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh();
  });

  $scope.saveSchedule = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    if (!$scope.slot.time) {
      navigator.notification.alert("Time can't be blank", null)
      $ionicLoading.hide()
      return
    }

    if (!$scope.slot.blood_pressure && !$scope.slot.weight && !$scope.slot.heart_rate && !$scope.slot.glucose) {
      navigator.notification.alert("You need to choose at least one metric", null)
      $ionicLoading.hide()
      return
    }

    return Measurement.updateSchedule($scope.slot).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }


  $scope.showModal = function(reminder) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/measurements/schedule.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      console.log(reminder)
      $scope.modal = modal;

      if (reminder && reminder.time)
        reminder.time = moment(reminder.time, "HH:mm").toDate()

      $scope.slot  = reminder || {};

      modal.show()
    });
  }


  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.slot  = {}
    $scope.modal = null
  }
})




// angular.module('app.controllers')
//
// //TODO: Clean this up...very ugly use ng repeat in the new_measurement_schedule.html
// .controller('measurementScheduleCtrl', function($scope, $ionicPopup, $state,Patient, MeasurementSchedule, Card, _) {
//   $scope.measurement_schedule = MeasurementSchedule.get();
//   $scope.newShedule = {
//     name: "weekday schedule",
//     time: new Date("2016-01-01 08:00"),
//     days: [false, false, false, false, false, false, false]
//   };
//
//   var displayAlert = function(message) {
//     var myPopup = $ionicPopup.show({
//       title: "Measurements missing",
//       subTitle: message,
//       scope: $scope,
//       buttons: [{text: 'OK'}]
//     });
//   }
//
//   $scope.save = function(){
//     if (!$scope.newShedule.name)
//       displayAlert("Please enter a measurement name");
//     else if( !$scope.newShedule.weight && !$scope.newShedule.blood_pressure && !$scope.newShedule.heart_rate ){
//       displayAlert("Please choose a measurement");
//     } else if( $scope.newShedule.days[0] == false && $scope.newShedule.days[1] == false && $scope.newShedule.days[2] == false
//               && $scope.newShedule.days[3] == false && $scope.newShedule.days[4] == false
//               && $scope.newShedule.days[5] == false && $scope.newShedule.days[6] == false) {
//         displayAlert("Please select a reminder day");
//     } else{
//        var schedule = {};
//        schedule.name   = $scope.newShedule.name;
//        schedule.hour   = $scope.newShedule.time.getHours();
//        schedule.minute = $scope.newShedule.time.getMinutes();
//        schedule.days = $scope.newShedule.days;
//        schedule.measurements = [];
//        if($scope.newShedule.weight == true){
//          schedule.measurements.push({'name':'weight','unit':'lbs'});
//        }
//        if($scope.newShedule.blood_pressure == true){
//          schedule.measurements.push({'name':'systolic blood pressure','unit':'mmHg'});
//          schedule.measurements.push({'name':'diastolic blood pressure','unit':'mmHg'});
//        }
//        if($scope.newShedule.heart_rate == true){
//          schedule.measurements.push({'name':'heart rate','unit':'bpm'});
//        }
//        var req = MeasurementSchedule.add(schedule);
//
//        // Create a new Card for the new time slot
//        req.then(function(snapshot) {
//          var today = new Date();
//          var tomorrow = new Date();
//          tomorrow.setDate(tomorrow.getDate() + 1);
//        })
//
//        $state.go('carePlan.measurementSchedules');
//     }
//   }
//
//   $scope.scheduledMeasurements = function() {
//     if($scope.measurement_schedule.length > 0){
//       return true;
//     }
//     return false
//   }
//
//   //Done onboarding!
//   var ref = Patient.ref();
//   var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})
//
// })
//
// .controller('measurementsCtrl', function($scope, $ionicSlideBoxDelegate, $ionicPopup, Measurement, MeasurementSchedule) {
//   $scope.measurementTab = {pageIndex: 0}
//   $scope.history = Measurement.get();
//   $scope.schedule = MeasurementSchedule.get();
//   $scope.newMeasurement = {};
//   $scope.schedule.$loaded().then(function() {
//     console.log($scope.schedule)
//   })
//
//
//   $scope.slideHasChanged = function(pageIndex) {
//     $scope.measurementTab.pageIndex = pageIndex;
//   }
//
//   $scope.transitionToPageIndex = function(pageIndex) {
//     $scope.measurementTab.pageIndex = pageIndex;
//     $ionicSlideBoxDelegate.slide(pageIndex);
//   }
//
//   var displayAlert = function(message) {
//     var myPopup = $ionicPopup.show({
//       title: "",
//       subTitle: message,
//       scope: $scope,
//       buttons: [{text: 'OK'}]
//     });
//   }
//
//   $scope.saveMeasurement = function(schedule) {
//     var measurement;
//
//     if(schedule=='custom') {
//       schedule = {$id: 'custom'}
//       measurement = $scope.newMeasurement['custom']
//     }
//     else {
//       console.log($scope.newMeasurement[schedule.$id]);
//       measurement = $scope.newMeasurement[schedule.$id]
//     }
//
//     Measurement.add(measurement, schedule);
//     $scope.newMeasurement = {};
//     displayAlert("Measurement has been saved");
//
//
//   };
//
//   $scope.disableSave = function(schedule_id) {
//     if($scope.newMeasurement.hasOwnProperty(schedule_id)) {
//       if(_.keys($scope.newMeasurement[schedule_id]).length > 0) {
//         return false;
//       }
//     }
//     else
//       return true;
//   };
//
// })
//
// .controller('addMeasurementsCtrl', function($scope, $state, $stateParams, Measurement, MeasurementSchedule, $ionicPopup, $ionicHistory) {
//   $scope.schedule = MeasurementSchedule.findByID($stateParams.schedule_id);
//   $scope.newMeasurement = {};
//   $scope.addMeasurement = function() {
//     Measurement.add($scope.newMeasurement, $scope.schedule);
//     if($ionicHistory.backView()==null)
//       $state.go('tabsController.timeline') //by default go to timeline
//     else
//       $state.go($ionicHistory.backView().stateName);
//   };
//
//   $scope.disableDone = function() {
//     if(_.keys($scope.newMeasurement).length > 0)
//       return false;
//     else
//       return true;
//   };
// })
//
// .controller('enterMeasurementsCtrl', function($scope, $state, $stateParams, Measurement, MeasurementSchedule, $ionicPopup, $ionicHistory) {
//   $scope.measurementHistory = Measurement.getTodaysHistory();
//   var bpcolor = 'black'
//
//   $scope.setColor = function(measurement_name) {
//     if(measurement_name.includes('blood pressure')) {
//       return bpcolor;
//     }
//     return 'black';
//   };
//
//   $scope.didTakeMeasurement = function(measurement_name, schedule) {
//     for(var i = 0; i < $scope.measurementHistory.length; i++) {
//       if(schedule.$id == $scope.measurementHistory[i].measurement_schedule_id) {
//       var measurements = $scope.measurementHistory[i].measurements;
//         if(typeof(measurements[measurement_name]) != 'undefined') {
//           return true
//         }
//       }
//     }
//     return false
//   };
//
//   $scope.getMeasurementValue = function(measurement_name) {
//     for(var i = 0; i < $scope.measurementHistory.length; i++) {
//       var measurements = $scope.measurementHistory[i].measurements;
//         if(typeof(measurements[measurement_name]) != 'undefined') {
//           return measurements[measurement_name]
//         }
//     }
//     return false
//   };
//
//   $scope.check = function(measurement_name, schedule_id) {
//     //Can come in with specific scheudle_id or not, need to check.
//     //can come frmo timline card(no specific schedule_id) or measurements tab(specific schedule_id)
//     var newMeasurement = typeof(schedule_id) =='undefined'? $scope.newMeasurement:$scope.newMeasurement[schedule_id]
//     if(measurement_name.includes('blood pressure')) {
//       if(Measurement.hasHighBP(newMeasurement)) {
//         bpcolor = 'red';
//         $scope.bpAlert('Blood Pressure High');
//       } else {
//         bpcolor = 'black';
//       }
//     }
//   };
//
//   $scope.bpAlert = function(value) {
//   $scope.data = {};
//
//   var myPopup = $ionicPopup.show({
//     title: value,
//     subTitle: 'Try taking another measurement in one minute. To ensure a good reading, please follow the tips.',
//     scope: $scope,
//     buttons: [
//       {
//         text: 'View Tips',
//         //TODO: go to tabsController.measurementTips if came to the tips screen from measurements tab
//         onTap: function(e) { $state.go('tabsController.measurementActionTips'); }
//       },
//       {text: '<b>OK</b>'}
//     ]
//   });
//   };
// })
//
// .controller('measurementTipsCtrl', function($scope, TIPS) {
//   // We inject the Measurement Tips factory so that we view tips
//   $scope.measurementsTips = TIPS;
// })
//
// .controller('measurementViewCtrl', function($scope, $stateParams, MeasurementSchedule, $ionicHistory, Card) {
//    $scope.schedule = MeasurementSchedule.findByID($stateParams.measurement_schedule_id);
//
//    $scope.schedule.$loaded().then(function () {
//        $scope.mytime = new Date();
//        $scope.mytime.setHours($scope.schedule.hour);
//        $scope.mytime.setMinutes($scope.schedule.minute);
//        console.log("loaded" + $scope.mytime);
//
//        $scope.measurement_items = [false, false, false];
//        if(typeof $scope.schedule.measurements !== "undefined"){
//          for(var i = 0; i < $scope.schedule.measurements.length; i++) {
//              if ($scope.schedule.measurements[i].name == "weight") {
//                $scope.measurement_items[0] = true;
//              }
//              if ($scope.schedule.measurements[i].name.includes("blood") ) {
//                $scope.measurement_items[1] = true;
//              }
//              if ($scope.schedule.measurements[i].name == "weight") {
//                $scope.measurement_items[2] = true;
//              }
//          }
//        }
//    });
//
//    $scope.updateSchedule = function(mytime) {
//      var hours = mytime.getHours();
//      var mins  = mytime.getMinutes();
//      hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) );
//      mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) );
//      console.log("updated " + mytime);
//
//      $scope.schedule.hour   = hours;
//      $scope.schedule.minute = mins;
//      $scope.schedule.measurements = [];
//
//      if($scope.measurement_items[0] == true){
//         $scope.schedule.measurements.push({'name':'weight','unit':'lbs'});
//      }
//      if($scope.measurement_items[1] == true){
//         $scope.schedule.measurements.push({'name':'systolic blood pressure','unit':'mmHg'});
//         $scope.schedule.measurements.push({'name':'diastolic blood pressure','unit':'mmHg'});
//      }
//      if($scope.measurement_items[2] == true){
//        $scope.schedule.measurements.push({'name':'heart rate','unit':'bpm'});
//      }
//
//      var req = $scope.schedule.$save();
//      req.then(function(snapshot) {
//        var today = new Date();
//        var tomorrow = new Date();
//        tomorrow.setDate(tomorrow.getDate() + 1);
//
//       //  Card.updateSchedCard(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, snapshot.key(), $scope.schedule, today.toISOString());
//       //  Card.updateSchedCard(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, snapshot.key(), $scope.schedule, tomorrow.toISOString());
//      })
//
//      $ionicHistory.goBack();
//
//    }
//
// })
