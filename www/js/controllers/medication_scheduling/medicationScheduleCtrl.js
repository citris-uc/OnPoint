angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicHistory, $ionicModal, Patient, Medication, MedicationSchedule, MedicationHistory, Card, Onboarding, $ionicLoading) {
  $scope.medication = {};

  $scope.dropped = function(index, medication, external, type, dateSchedule) {
    medication_id = medication.$id || medication.id
    if (dateSchedule[medication_id])
      return false
    else
      return medication

    // if (_.find(dateSchedule.medications, function(m) { return (m.id == medication.$id || m.id == medication.id) }))
    //   return false
    // else
    //   return medication
  }

  $scope.inserted = function(index, medication, external, type, dateSchedule) {
    console.log("INSERTED---")
    console.log(medication)
    console.log()
    console.log("---")

    MedicationSchedule.addMedication(dateSchedule.$id, medication)
  }

  $scope.removeMedicationFromSchedule = function(medication_id, dateSchedule) {
    MedicationSchedule.removeMedication(dateSchedule.$id, medication_id)
  }

  $scope.droppedToMedications = function(index, medication, external, type) {
    return true
  }

  $scope.medicationsArrayForSchedule = function(schedule) {
    return _.values(schedule.medications)
  }


  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})

    Medication.get().then(function(meds) {
      $scope.medications = meds
    })

    MedicationSchedule.get().then(function(medscheds) {
      console.log("medscheds: ")
      console.log(medscheds)
      $scope.schedule = medscheds
      // _.each($scope.schedule, function(s) {
      //   s.medications = _.values(s.medications)
      // })
    }).then(function() {


      // _.each(document.getElementsByClassName("container-element"), function(el) {
      //   console.log(el)
      // })
      // ionic.EventController.off("dragstart", null, document.getElementsByClassName("draggable-element"))
      // ionic.EventController.off("drag", null, document.getElementsByClassName("draggable-element"))
      // ionic.EventController.off("dragend", null, document.getElementsByClassName("draggable-element"))





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

  $scope.addMedicationToSlot = function(med) {
    MedicationSchedule.addMedication($scope.currentSlotID, med).then(function(res) {
      $scope.medication = {};
      $scope.closeModal()
    })
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
