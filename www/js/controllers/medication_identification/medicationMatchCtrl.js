
angular.module('app.controllers')
.controller('medicationMatchCtrl', function($scope, $state, $stateParams, $ionicPopover, Medication, $ionicLoading, $ionicHistory) {
  $scope.drug       = {}
  $scope.medication = {}
  $scope.units = [{value: "mg", display: "mg"}]

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading info...", hideOnStateChange: true})

    console.log("Params in medicationMatchCtrl: ")
    ocr = angular.fromJson($state.params.ocr)
    console.log(ocr)

    Medication.searchByRXCUI($state.params.rxcui).then(function(response) {
      console.log(response)
      $scope.drug = response.data
      $scope.drug.units = "mg"
      if (ocr) {
        $scope.drug.amount = ocr.amount
        $scope.drug.delivery = ocr.delivery
        $scope.drug.frequency = ocr.frequency
        $scope.drug.administration = $scope.drug.amount + " " + $scope.drug.delivery
      }
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
