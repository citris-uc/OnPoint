angular.module('app.controllers')

.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory, $ionicLoading) {
  $scope.drug  = {}
  $scope.units = Medication.units

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
    $scope.drug.$remove().then(function(response) {
      $ionicHistory.goBack(-1)
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    })
   }
})
