angular.module('app.controllers')

.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory, $ionicLoading, MedicationSchedule, $ionicModal) {
  $scope.drug  = {}
  $scope.units           = Medication.units
  $scope.administrations = Medication.administrations
  $scope.frequencies     = Medication.frequencies

  $scope.colors = ["#FF5733", "#FFC0CB", "#FFA500", "#FFDAB9", "#FFFE0", "#D2B48C", "#800080", "#D8BFD8", "#2E8B57", "#90EE90", "#00008B", "#ADD8E6", "#FFFFFF", "#FFFFF0", "#000000", "#D3D3D3", "#A0522D"]
  $scope.shapes = ["3sided","5sided","6sided","7sided","8sided", "diamond", "oblong","oval","rectangle", "round","square","teardrop"]


  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({hideOnStateChange: true});

    Medication.getById($state.params.id).then(function(med) {
      $scope.drug = med
      console.log(med)
    }).finally(function() {
      $ionicLoading.hide();
    })
  })

  $scope.update = function() {
    if (!$scope.drug.name) {
      alert("Please enter the name of the medication")
      return
    }
    if (!$scope.drug.administration) {
      alert("Please describe how you're supposed to take this medication")
      return
    }
    if (!$scope.drug.dosage || !$scope.drug.units) {
      alert("Please enter the dosage and units of this medication")
      return
    }
    if (!$scope.drug.frequency) {
      alert("Please describe how often you take this medication")
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
})
