angular.module('app.controllers')
.controller("medicationScheduleCardCtrl", function($scope, $state, $stateParams, $ionicModal, $ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory, $ionicLoading, Card) {
  $scope.drug     = {}
  $scope.history  = []
  $scope.card     = {}

  $scope.$on('$ionicView.loaded', function(){
    $ionicLoading.show({hideOnStateChange: true})

    MedicationSchedule.getByID($stateParams.schedule_id).then(function(doc) {
      console.log($scope.schedule)
      $scope.schedule = doc
    }).then(function() {
      return MedicationHistory.getHistory()
    }).then(function(doc) {
      $scope.history = doc
      return Card.getByID($state.params.card_id)
    }).then(function(doc) {
      console.log("CARD: ")
      console.log(doc)
      $scope.card = doc
    }).finally(function() {
      $ionicLoading.hide()
    });
  });

  $scope.medModal = function(med) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/cards/medication.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      return modal.show()
    }).then(function() {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading medication...", hideOnStateChange: true})
      return Medication.getById(med.id)
    }).then(function(drug) {
      console.log("DRUG: ")
      console.log(drug)
      $scope.drug = drug
    }).finally(function() {
      $ionicLoading.hide()
    }).catch(function(err) {
      console.log("ERR: ")
      console.log(err)
    })
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  }

  $scope.showNoteModal = function(med) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/cards/note.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      return modal.show()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }


  $scope.takeMedication = function() {
    $ionicLoading.show({hideOnStateChange: true})
    MedicationHistory.create_or_update($scope.drug, $scope.schedule, "take").then(function() {
      $ionicLoading.hide();
      $scope.closeModal();
    });
  }

  $scope.skipMedication = function()  {
    c = confirm("Are you sure you want to skip this medication?")
    if (!c)
      return

    $ionicLoading.show({hideOnStateChange: true})
    MedicationHistory.create_or_update($scope.drug, $scope.schedule, "skip").then(function() {
      $ionicLoading.hide();
      $scope.closeModal();
    })
  };

  $scope.noDecisionOnMedication = function(med) {
    state = true
    for (var i=0; i < $scope.history.length; i++) {
      if ($scope.history[i].medication_id == med.id)
        state = !$scope.history[i].skipped_at && !$scope.history[i].taken_at
    }
    return state
  }


  $scope.didTakeMed = function(med) {
    state = false
    for (var i=0; i < $scope.history.length; i++) {
      if ($scope.history[i].medication_id == med.id)
        state = !!$scope.history[i].taken_at
    }

    return state
  }

  $scope.didSkipMed = function(med) {
    state = false
    for (var i=0; i < $scope.history.length; i++) {
      if ($scope.history[i].medication_id == med.id)
        state = !!$scope.history[i].skipped_at
    }

    return state
  }


  $scope.updateNote = function() {
    $ionicLoading.show({hideOnStateChange: true})
    $scope.card.$save().then(function() {
      $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
