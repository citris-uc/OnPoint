angular.module('app.controllers')

.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory, $ionicLoading) {
  $scope.drug  = {}
  $scope.units = [{value: "mg", display: "mg"}]

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
    $ionicLoading.show({hideOnStateChange: true})

    $scope.drug.$save().then(function() {
      $ionicHistory.goBack(-1)
    }).finally(function() {
      return $ionicLoading.hide()
    })
  }

  $scope.removeMedication = function() {
    $scope.medication.$remove().then(function(response) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      })
      $state.go("medication_identification.start")
    }).catch(function(response) {
      $scope.$emit(onpoint.env.error, response)
    })
   }
})
