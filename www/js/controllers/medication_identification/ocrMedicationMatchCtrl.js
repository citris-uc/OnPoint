
angular.module('app.controllers')
.controller('ocrMedicationMatchCtrl', function($scope, $state, $ionicPopover, Medication, $ionicLoading, $ionicHistory) {
  $scope.drug       = {}
  $scope.medication = {}
  $scope.ocr        = angular.fromJson($state.params.ocr)

  $scope.navigateToMatch = function(drug) {
    // ui-sref="medication_identification.match({rxcui: drug.rxcui})"
    $state.go("medication_identification.match", {rxcui: drug.rxcui, ocr: $state.params.ocr}, {reload: true})
  }

  $scope.$on("$ionicView.loaded", function() {
    // alert($state.params.ocr)
    $ionicLoading.show({hideOnStateChange: true})

    if (onpoint.env.environment == "development")
      $scope.ocr = {drug_name: "LAMOTRIGINE", amount: "2 TABLETS", delivery: "BY MOUTH", frequency: "EVERY DAY"}

    Medication.search($scope.ocr.drug_name).then(function(response) {
      console.log(response)
      $scope.drugs = response.data
    }).finally(function(res) {
      $ionicLoading.hide()
    })
  })

  // $scope.add = function() {
  //   $ionicHistory.goBack(-2)
  // }
})
