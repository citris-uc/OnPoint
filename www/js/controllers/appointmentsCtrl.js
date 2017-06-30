angular.module('app.controllers')

.controller('appointmentsCtrl', function($scope, $location, $state, Appointment, $ionicLoading, $ionicModal) {
  $scope.appointments = {}
  $scope.appt         = {}
  $scope.state = {}

  var fromDate = new Date();
  var toDate   = new Date();

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Appointment.getAll().then(function(doc) {
      $scope.appointments = doc
      $scope.$broadcast('scroll.refreshComplete');
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh();
  });

  $scope.save = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    if (!$scope.appt.title) {
      navigator.notification.alert("Title can't be blank", null)
      $ionicLoading.hide()
      return
    }

    if (!$scope.appt.date) {
      navigator.notification.alert("Date can't be blank", null)
      $ionicLoading.hide()
      return
    }

    if (!$scope.appt.time) {
      navigator.notification.alert("Time can't be blank", null)
      $ionicLoading.hide()
      return
    }

    $scope.appt.time = moment($scope.appt.time).format('HH:mm');

    Appointment.add($scope.appt).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $scope.appt = {}
      $ionicLoading.hide()
    })
  };

  $scope.update = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    if (!$scope.appt.title) {
      navigator.notification.alert("Title can't be blank", null)
      $ionicLoading.hide()
      return
    }

    if (!$scope.appt.date) {
      navigator.notification.alert("Date can't be blank", null)
      $ionicLoading.hide()
      return
    }

    if (!$scope.appt.time) {
      navigator.notification.alert("Time can't be blank", null)
      $ionicLoading.hide()
      return
    }

    $scope.appt.time = moment($scope.appt.time).format('HH:mm');

    Appointment.update($scope.state.appointment_date, $scope.state.appointment_id, $scope.appt).then(function(appt) {
      return $scope.closeModal()
    }).catch(function(res) {
      console.log("ERROR")
      console.log(res)
      $scope.$emit(onpoint.error, res)
    }).finally(function() {
      $scope.appt = {}
      $ionicLoading.hide()
    })
  };

  $scope.destroy = function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Deleting...", hideOnStateChange: true})

    Appointment.destroy($scope.state.appointment_date, $scope.state.appointment_id).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $scope.appt = {}
      $ionicLoading.hide()
    })
  };

  $scope.showModal = function() {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/appointments/new.html', {
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

  $scope.showEditModal = function(appt_date, appt_id, appointment) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/appointments/edit.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      appt = {}
      for (var key in appointment)
        appt[key] = appointment[key]

      if (appt.time)
        appt.time = moment(appointment.time, "HH:mm").toDate()
      if (appt.date)
        appt.date = moment(appointment.date, "YYYY-MM-DD").toDate()


      $scope.state.appointment_date = appt_date
      $scope.state.appointment_id   = appt_id
      $scope.appt  = appt
      $scope.modal = modal;
      modal.show()
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.state = {};
  }

  /*
   * We store dates in firebase in ISO format which is zero UTC offset
   * therefore we cannot simply display the date that is stored in firebase, we need to display local time
   */
  $scope.setLocaleDate = function(utc_date) {
    var iso = (new Date()).toISOString(); //get current ISO String
    var iso_altered = utc_date.concat(iso.substring(10)); //replace date portion with date from firebase
    var local = new Date(iso_altered); //Date() constructor automatically sets local time!
    return local;
  }
})
