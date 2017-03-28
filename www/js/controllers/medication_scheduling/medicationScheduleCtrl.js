angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicHistory, $ionicModal, Patient, Medication, MedicationSchedule, MedicationHistory, Card, Onboarding, $ionicLoading) {
  $scope.medication = {};

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})

    Medication.get().then(function(meds) {
      $scope.medications = meds
    })

    MedicationSchedule.get().then(function(medscheds) {
      $scope.schedule = medscheds
    }).finally(function() {
      $ionicLoading.hide()
    })
  })

  $scope.addMedicationModal = function(slotId) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/medication_scheduling/add.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.currentSlotID = slotId
      $scope.modal = modal;
      modal.show()
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  }

  $scope.addMedicationToSlot = function(id) {
    MedicationSchedule.addMedication($scope.currentSlotID, $scope.medication.name).then(function(res) {
      $scope.medication = {};
      $scope.closeModal()
    })
  }

  $scope.removeMedication = function(slotID, medication) {
    MedicationSchedule.removeMedication(slotID, medication)
  }

  $scope.completeMedicationScheduling = function() {
    if ($scope.schedule.length == 0)
      return
    $ionicLoading.show({hideOnStateChange: true})

    // This will force-generate cards for today and tomorrow (if not already exist).
    Card.forceGenerate().then(function(res) {
      Onboarding.update({'medication_scheduling':true}).then(function(response) {
        // TODO: If we introduce filling the pillbox, then let's uncomment this.
        $state.go("medication_scheduling.fill_pillbox_welcome", {}, {reload: true});
        // $state.go("onboarding.complete", {}, {reload: true});
      })
    }).finally(function(res) {
      $ionicLoading.hide();
    })
  }
})



.controller('pillboxCtrl', function($scope, $q, $state, $ionicLoading, $ionicHistory, MedicationSchedule, Medication, MedicationDosage, Patient, _) {
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


  $scope.doneMedSetup = function() {
    $state.go("onboarding.complete", {}, {reload: true});
  }
})
