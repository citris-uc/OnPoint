angular.module('app.controllers')
.controller('pillboxCtrl', function($scope, $q, $state, $ionicLoading, MedicationSchedule, Medication, MedicationDosage, Patient, _) {
  $scope.schedule = []
  $scope.medications = []
  $scope.selectedMed = {}
  $scope.selectedMedications = []

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading list of medications...", hideOnStateChange: true})

    Medication.get().then(function(meds) {
      $scope.medications = meds
      return $ionicLoading.hide()
    }).then(function() {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})
      return MedicationSchedule.get()
    }).then(function(schedule) {
      $scope.schedule = schedule
      return $ionicLoading.hide()
    }).then(function(schedule) {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Populating the fillbox...", hideOnStateChange: true})

      _.each($scope.schedule, function(schedule) {
        schedule.slots = []

        for(var day = 0; day < 7; day++) {
          // Add the capsules to the pillbox view only if they're supposed
          // to be viewed on that day.

          if (schedule.days[day] && !_.isUndefined(schedule.medications) ) {
            meds    = _.toArray(schedule.medications)
            med_ids = meds.map(function(el) { return el.id})
            schedule.slots.push({medications: med_ids})
          } else {
            schedule.slots.push({medications: []});
          }

        }
      })

    }).then(function() {
      return $ionicLoading.hide()
    }).catch(function(err) {
      navigator.notification.alert("ERROR: " + JSON.stringify(err), null)
    })
  })

  $scope.displaySchedule = function(med){
    $scope.resetPillbox()

    $scope.selectedMedications.push(med);
    $scope.selectedMed = med //set the selected med

    _.each($scope.schedule, function(schedule) {
      _.each(schedule.slots, function(slot) {
        if (slot.medications.indexOf($scope.selectedMed.$id) > -1) {
          slot.dosage = $scope.selectedMed.dosage + " " + $scope.selectedMed.units
        }
      })
    })
  }

  $scope.resetPillbox = function() {
    _.each($scope.schedule, function(schedule) {
      _.each(schedule.slots, function(slot) {
        slot.dosage = null
      })
    })
  }

  $scope.currentlyOn = function(med){
    return ($scope.selectedMed == med)
  }

  $scope.hasSelected = function(med){
    return _.contains($scope.selectedMedications, med)
  }
})

// TODO: The 2 can be merged.
.controller('completePillboxCtrl', function($scope, $q, $state, $ionicLoading, MedicationSchedule, Medication, MedicationDosage, Patient, _) {
  $scope.schedule = []
  $scope.medications = []
  $scope.selectedMed = {}
  $scope.selectedMedications = []

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading list of medications...", hideOnStateChange: true})

    Medication.get().then(function(meds) {
      $scope.medications = meds
      return $ionicLoading.hide()
    }).then(function() {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})
      return MedicationSchedule.get()
    }).then(function(schedule) {
      $scope.schedule = schedule
      return $ionicLoading.hide()
    }).then(function(schedule) {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Populating the fillbox...", hideOnStateChange: true})

      _.each($scope.schedule, function(schedule) {
        schedule.slots = []

        for(var day = 0; day < 7; day++) {
          // Add the capsules to the pillbox view only if they're supposed
          // to be viewed on that day.

          if (schedule.days[day] && !_.isUndefined(schedule.medications) ) {
            meds    = _.toArray(schedule.medications)
            med_ids = meds.map(function(el) { return (el.nickname || el.name) + " x " + el.dosage })
            schedule.slots.push({medications: med_ids})
          } else {
            schedule.slots.push({medications: []});
          }

        }
      })

    }).then(function() {
      return $ionicLoading.hide()
    }).catch(function(err) {
      navigator.notification.alert("ERROR: " + JSON.stringify(err), null)
    })
  })
})
