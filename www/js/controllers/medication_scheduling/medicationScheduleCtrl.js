angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicHistory, $ionicModal, Patient, Medication, MedicationSchedule, MedicationHistory, Card, Onboarding, $ionicLoading, $firebaseArray) {
  $scope.medication = {};
  // $scope.schedule = $firebaseArray( new Firebase("https://vivid-inferno-5187.firebaseio.com/patients/dde68176-a20c-46b5-add0-e08815ee812f/medication_schedules/default") );


  // $scope.removeMedFromSlot = function(dateSchedule, medication) {
  //   MedicationSchedule.removeMedication(dateSchedule.$id, medication.id)
  //   $scope.medications.push(medication)
  // }
  //
  // $scope.addMedToSlot = function(dateSchedule, medication) {
  //   dateSchedule.medications = _.values(dateSchedule.medications)
  //   console.log("addMedToSlot")
  //   console.log(dateSchedule.medications)
  //   console.log("---")
  //   index = _.findIndex(dateSchedule.medications, function(m) { console.log("m.id=" + m.id + " medication.$id=" + medication.$id); return m.id == medication.$id })
  //   if (index == -1) {
  //     MedicationSchedule.addMedication(dateSchedule.$id, medication)
  //
  //
  //
  //     index = _.findIndex($scope.medications, function(m) { return (m.$id == medication.$id) })
  //     console.log("dateSchedule.medications = " + JSON.stringify(dateSchedule.medications))
  //     dateSchedule.medications.push(medication)
  //     $scope.medications.splice(index, 1)
  //   }
  //   $scope.modal.hide()
  // }

  $scope.dropToSlotCallback = function(event, index, item, external, type, allowedType, dateSchedule, listnull) {
    // Check if medications list exists.  If not, create it.
    if (listnull) {
      dateSchedule.medications = [];
    }
    // Check if med exists in medications array - if exists, prevent drop

    index = _.findIndex(dateSchedule.medications, function(m) { return m.id == item.id})

    console.log("dateSchedule.medications = " + JSON.stringify(dateSchedule.medications))
    console.log("item = " + JSON.stringify(item))
    console.log(index)


    if (index >= 0)
      return false
    else {
      MedicationSchedule.addMedication(dateSchedule.$id, item)
      return item;
    }
  };

  $scope.removeFromSchedule = function(dateSchedule, index) {
    console.log(JSON.stringify(dateSchedule.medications))
    med = dateSchedule.medications[index]

    // if (_.isObject(dateSchedule.medications))

    MedicationSchedule.removeMedication(dateSchedule.$id, med.id)
    dateSchedule.medications.splice(index, 1)
  }

  $scope.removeFromMedications = function(index) {
    $scope.medications.splice(index, 1)
  }

  $scope.dropCallback = function(event, index, item, external, type, allowedType, list, listnull) {
    // console.log("Drop callback called!")
    // MedicationSchedule.removeMedication(dateSchedule.$id, medication_id)
    // $scope.medications.push(item)
    return item;

    // Check if medications list exists.  If not, create it.
    // if (listnull) {
    //   list.medications = [];
    // }
    // Check if med exists in medications array - if exists, prevent drop
    // for (var i = 0; i < list.medications.length; i++) {
    //   if (list.medications[i] == item) return false;
    // }
    // if (external) {
    //     if (allowedType === 'itemType' && !item.label) return false;
    //     if (allowedType === 'containerType' && !angular.isArray(item)) return false;
    // }
    // return item;
  };


  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading schedule...", hideOnStateChange: true})

    Medication.get().then(function(meds) {

      $scope.medications = []
      _.each(meds, function(med) {
        med.id = med.$id

        count = Medication.frequencies_to_i[med.frequency]
        if (count)
          _(count).times(function(index) { $scope.medications.push(med)})
        else
          $scope.medications.push(med)
      })


    }).then(function() {
      return MedicationSchedule.get()
    }).then(function(medscheds) {
      schedules = angular.copy(medscheds)

      _.each(schedules, function(s) {
        meds_for_schedule = _.values(s.medications)


        _.each(meds_for_schedule, function(med) {
          index = _.findIndex($scope.medications, function(m) { return m.$id == med.id || m.$id == med.$id})
          if (index >= 0)
            $scope.medications.splice(index, 1)
        })

        s.medications = meds_for_schedule
      })

      $scope.schedule = schedules

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



  // $scope.dropped = function(index, medication, external, type, dateSchedule) {
  //   window.alert("dropped: " + JSON.stringify(medication))
  //   medication_id = medication.$id || medication.id
  //   console.log(dateSchedule.medications)
  //   if (_.find(dateSchedule.medications, function(m) { return m.id == medication_id }) )
  //     return false
  //   else
  //     return medication
  // }

  // $scope.inserted = function(index, medication, external, type, dateSchedule) {
  //   window.alert("inserted: " + JSON.stringify(medication))
  //   MedicationSchedule.addMedication(dateSchedule.$id, medication)
  // }
  //
  // $scope.removeMedicationFromSchedule = function(medication_id, dateSchedule) {
  //   ind = _.findIndex(dateSchedule.medications, function(m) { return m.id == medication_id})
  //   dateSchedule.medications.splice(ind, 1)
  //   MedicationSchedule.removeMedication(dateSchedule.$id, medication_id)
  // }
  //
  // $scope.droppedToMedications = function(index, medication, external, type) {
  //   window.alert("droppedToMedications: " + JSON.stringify(medication))
  //   $scope.medications.push(medication)
  //   return true
  // }
  //
  // $scope.medicationsArrayForSchedule = function(schedule) {
  //   return _.values(schedule.medications)
  // }
})
