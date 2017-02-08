
angular.module('app.controllers')
.controller('medicationMatchCtrl', function($scope, $state, $ionicPopover, Medication, $ionicLoading, $ionicHistory) {
  $scope.drug       = {}
  $scope.medication = {}

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show()

    Medication.searchByRXCUI($state.params.rxcui).then(function(response) {
      $scope.drug = response.data
    }).finally(function(res) {
      $ionicLoading.hide()
    })
  })

  $scope.add = function() {
    $ionicHistory.goBack(-2)

    // TODO TODO
    // firebaseRecord = $scope.medication
    // firebaseRecord["trade_name"]   = $scope.medication.trade_name
    // firebaseRecord['instructions'] = $scope.medication.instructions
    // firebaseRecord['dose']    = $scope.medication.dose
    // firebaseRecord['purpose'] = $scope.medication.purpose
    // firebaseRecord['notes']   = $scope.medication.notes
    //
    // Medication.get().$add($scope.medication).then(function(response) {
    //   console.log(response)
    //   $ionicHistory.goBack(-2)
    // }, function(response) {
    //   console.log("Error")
    //   console.log(response)
    // })
  }
})
