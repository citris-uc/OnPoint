angular.module('app.controllers')

.controller('measurementsCtrl', function($scope, $state, Measurement, $ionicLoading, $ionicModal) {
  $scope.measurements = {}
  $scope.measurement  = {}
  $scope.state        = {}

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Measurement.getAll().then(function(doc) {
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

    if (!$scope.measurement.glucose && !$scope.measurement.weight && !$scope.measurement.heart_rate && !$scope.measurement.temperature && !$scope.measurement.systolic && !$scope.measurement.diastolic) {
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

    if (!$scope.slot.blood_pressure && !$scope.slot.weight && !$scope.slot.heart_rate && !$scope.slot.temperature && !$scope.slot.glucose) {
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
