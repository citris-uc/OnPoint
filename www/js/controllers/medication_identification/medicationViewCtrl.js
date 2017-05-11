angular.module('app.controllers')

.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory, $ionicLoading, MedicationSchedule, $ionicModal) {
  $scope.drug  = {}
  $scope.units           = Medication.units
  $scope.administrations = Medication.administrations
  $scope.frequencies     = Medication.frequencies

  $scope.colors = ["#FFFFFF", "#FFFFF0", "#FF5733", "#FFC0CB", "#FFA500", "#FFDAB9", "#FFFE0", "#D2B48C", "#800080", "#D8BFD8", "#2E8B57", "#90EE90", "#00008B", "#ADD8E6", "#000000", "#D3D3D3", "#A0522D"]
  $scope.shapes = ["oval", "triangle", "5sided", "6sided", "7sided", "8sided", "diamond", "rectangle", "square", "teardrop"]


  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({hideOnStateChange: true});

    Medication.getById($state.params.id).then(function(med) {
      $scope.drug = med
      console.log(med)
    }).finally(function() {
      $ionicLoading.hide();
    })
  })

  $scope.allowSave = function() {
    if (!$scope.drug.name) {
      return false
    }
    if (!$scope.drug.administration) {
      return false
    }
    if (!$scope.drug.dosage || !$scope.drug.units) {
      return false
    }
    if (!$scope.drug.frequency) {
      return false
    }

    if (!$scope.drug.shape) {
      return false
    }

    if (!$scope.drug.color) {
      return false
    }

    return true;
  }

  $scope.update = function() {
    if (!$scope.drug.name) {
      alert("Please enter name of the medication")
      return
    }
    if (!$scope.drug.administration) {
      alert("Please enter way of administration")
      return
    }
    if (!$scope.drug.dosage || !$scope.drug.units) {
      alert("Please enter dosage and units of this medication")
      return
    }
    if (!$scope.drug.frequency) {
      alert("Please enter frequency of this medication")
      return
    }

    if (!$scope.drug.shape) {
      alert("Please describe shape of the medication")
      return
    }

    if (!$scope.drug.color) {
      alert("Please describe color of the medication")
      return
    }

    $ionicLoading.show({hideOnStateChange: true})

    $scope.drug.$save().then(function() {
      $ionicHistory.goBack(-1)
    }).finally(function() {
      return $ionicLoading.hide()
    })
  }

  $scope.remove = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Removing...", hideOnStateChange: true})

    MedicationSchedule.removeMedicationFromSchedule($scope.drug).then(function(response) {
      return $scope.drug.$remove()
    }).then(function() {
      return $ionicHistory.goBack(-1)
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    }).finally(function(res) {
      $ionicLoading.hide()
    })
   }



   $scope.chooseShape = function(shape) {
     $scope.drug.shape = shape
     $scope.closeModal()
   }

   $scope.chooseColor = function(color) {
     $scope.drug.color = color
     $scope.closeModal()
   }


   $scope.closeModal = function() {
     $scope.modal.hide()
   }

   $scope.shapeModal = function(med) {
     // Create the login modal that we will use later
     return $ionicModal.fromTemplateUrl('templates/medications/shape.html', {
       scope: $scope,
       animation: 'slide-in-up',
       focusFirstInput: true,
       backdropClickToClose: false,
       hardwareBackButtonClose: false
     }).then(function(modal) {
       $scope.modal = modal;
       return modal.show()
     })
   }

   $scope.colorModal = function(med) {
     // Create the login modal that we will use later
     return $ionicModal.fromTemplateUrl('templates/medications/color.html', {
       scope: $scope,
       animation: 'slide-in-up',
       focusFirstInput: true,
       backdropClickToClose: false,
       hardwareBackButtonClose: false
     }).then(function(modal) {
       $scope.modal = modal;
       return modal.show()
     })
   }


})
