
angular.module('app.controllers')
.controller('medicationMatchCtrl', function($scope, $state, $stateParams, $ionicPopover, Medication, $ionicLoading, $ionicHistory) {
  $scope.drug  = {}
  $scope.units = Medication.units
  $scope.ocr   = angular.fromJson($state.params.ocr)
  $scope.search = $state.params.search
  console.log($state.params)

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading info...", hideOnStateChange: true})

    Medication.searchByRXCUI($state.params.rxcui).then(function(response) {
      $scope.drug = response.data
      $scope.drug.units = "tablets"

      if (!$scope.drug.nickname)
        $scope.drug.nickname = $state.params.search

      if ($scope.ocr) {
        $scope.drug.amount    = $scope.ocr.amount
        $scope.drug.delivery  = $scope.ocr.delivery
        $scope.drug.frequency = $scope.ocr.frequency
        // $scope.drug.purpose   = $scope.ocr.raw_text

        if ($scope.drug.amount && $scope.drug.delivery)
          $scope.drug.administration = $scope.drug.amount + " " + $scope.drug.delivery
      }
    }).finally(function(res) {
      $ionicLoading.hide()
    })
  })

  $scope.add = function() {
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

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Adding medication...", hideOnStateChange: true})

    Medication.add($scope.drug).then(function(response) {
      console.log(response)
      if (!!$scope.ocr)
        $ionicHistory.goBack(-3)
      else
        $ionicHistory.goBack(-2)
    }).catch(function(response) {
      console.log("Error")
      console.log(response)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
