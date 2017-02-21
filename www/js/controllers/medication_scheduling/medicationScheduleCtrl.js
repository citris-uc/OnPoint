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

  // $scope.sortSchedule = function() {
  //   $scope.schedule.sort(function(a, b){var dat1 = a.time.split(":"); var dat2 = b.time.split(":");
  //                           return parseInt(dat1[0]+dat1[1]) - parseInt(dat2[0]+dat2[1])});
  // }

  // $scope.dropCallback = function(event, index, item, external, type, allowedType, list, listnull) {
  //     // Check if medications list exists.  If not, create it.
  //     if (listnull) {
  //       list.medications = [];
  //     }
  //     // Check if med exists in medications array - if exists, prevent drop
  //     for (var i = 0; i < list.medications.length; i++) {
  //       if (list.medications[i] == item) return false;
  //     }
  //     if (external) {
  //         if (allowedType === 'itemType' && !item.label) return false;
  //         if (allowedType === 'containerType' && !angular.isArray(item)) return false;
  //     }
  //     return item;
  // };


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
        // $state.go("medication_scheduling.fill_pillbox_welcome", {}, {reload: true});
        $state.go("onboarding.complete", {}, {reload: true});
      })
    }).finally(function(res) {
      $ionicLoading.hide();
    })
  }
})
