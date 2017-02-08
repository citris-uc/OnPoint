angular.module('app.controllers')

.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory, $ionicLoading) {
  Medication.getById($state.params.id).then(function(med) {
    $scope.medication = med
  })

  $scope.update = function() {
    $ionicLoading.show({hideOnStateChange: true})

    $scope.medication.$save().then(function(res) {
      return $ionicLoading.hide()
    }).then(function() {
      $ionicHistory.goBack(-1)
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
