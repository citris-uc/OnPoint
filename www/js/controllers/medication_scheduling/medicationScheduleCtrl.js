angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicHistory, $ionicModal, Patient, Medication, MedicationSchedule, MedicationHistory, Card, Onboarding, $ionicLoading) {
  $scope.medication = {};

  $scope.removeMedFromSlot = function(dateSchedule, medication) {
    MedicationSchedule.removeMedication(dateSchedule.$id, medication.id)
    $scope.medications.push(medication)
  }

  $scope.addMedToSlot = function(dateSchedule, medication) {
    console.log(dateSchedule)
    window.test = dateSchedule.medications
    index = _.findIndex(dateSchedule.medications, function(m) { return m.id == medication.$id })
    if (index == -1) {
      MedicationSchedule.addMedication(dateSchedule.$id, medication)
      index = _.findIndex($scope.medications, function(m) { return (m.$id == medication.$id) })
      console.log("INDEX IS: " + index)
      $scope.medications.splice(index, 1)
    }
    $scope.modal.hide()
  }

  $scope.dropped = function(index, medication, external, type, dateSchedule) {
    window.alert("dropped: " + JSON.stringify(medication))
    medication_id = medication.$id || medication.id
    console.log(dateSchedule.medications)
    if (_.find(dateSchedule.medications, function(m) { return m.id == medication_id }) )
      return false
    else
      return medication

    // if (_.find(dateSchedule.medications, function(m) { return (m.id == medication.$id || m.id == medication.id) }))
    //   return false
    // else
    //   return medication
  }

  // $scope.onDrop = function(srcList, srcIndex, targetList, targetIndex) {
  //   if (srcList == targetList)
  //     return false
  //   // Copy the item from source to target.
  //   targetList.splice(targetIndex, 0, srcList[srcIndex]);
  //   // Remove the item from the source, possibly correcting the index first.
  //   // We must do this immediately, otherwise ng-repeat complains about duplicates.
  //   if (srcList == targetList && targetIndex <= srcIndex) srcIndex++;
  //   srcList.splice(srcIndex, 1);
  //   // By returning true from dnd-drop we signalize we already inserted the item.
  //   return true;
  // };

  $scope.inserted = function(index, medication, external, type, dateSchedule) {
    window.alert("inserted: " + JSON.stringify(medication))
    MedicationSchedule.addMedication(dateSchedule.$id, medication)
  }

  $scope.removeMedicationFromSchedule = function(medication_id, dateSchedule) {
    ind = _.findIndex(dateSchedule.medications, function(m) { return m.id == medication_id})
    dateSchedule.medications.splice(ind, 1)
    MedicationSchedule.removeMedication(dateSchedule.$id, medication_id)
  }

  $scope.droppedToMedications = function(index, medication, external, type) {
    window.alert("droppedToMedications: " + JSON.stringify(medication))
    $scope.medications.push(medication)
    return true
  }

  $scope.medicationsArrayForSchedule = function(schedule) {
    return _.values(schedule.medications)
  }


  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})

    Medication.get().then(function(meds) {

      $scope.medications = []
      _.each(meds, function(med) {
        count = Medication.frequencies_to_i[med.frequency]
        if (count)
          _(count).times(function(index) { $scope.medications.push(med)})
        else
          $scope.medications.push(med)
      })


    }).then(function() {
      return MedicationSchedule.get()
    }).then(function(medscheds) {
      $scope.schedule = medscheds

      _.each($scope.schedule, function(s) {
        meds_for_schedule = _.values(s.medications)
        console.log(meds_for_schedule)


        _.each(meds_for_schedule, function(med) {
          index = _.findIndex($scope.medications, function(m) { return m.$id == med.id || m.$id == med.$id})
          if (index >= 0)
            $scope.medications.splice(index, 1)
        })

        s.medications = meds_for_schedule
      })


    }).finally(function() {
      $ionicLoading.hide()
    })
  })

  $scope.addSlotModal = function(medication) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/medication_scheduling/add_to_slot.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.medication = medication;
      $scope.modal      = modal;
      modal.show()
    });
  }

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
    Card.deleteUpcomingCards().then(function(res) {
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
