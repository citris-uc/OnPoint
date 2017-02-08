
// TODO: Implement once we have RxNorm. See #516
angular.module('app.controllers')
.controller('medicationSearchCtrl', function($scope, $state, Medication, $ionicLoading, Patient) {
    $scope.medication = {};
    $scope.params     = {noDrugMatch: false};
    $scope.drugs      = [];

    $scope.search = function() {
      $ionicLoading.show()

      Medication.search($scope.params.search).then(function(response) {
        $scope.drugs = response.data
        $scope.params.noDrugMatch = ($scope.drugs == 0)
      }, function(response) {
        console.log(JSON.stringify(response))
        $scope.$emit(onpoint.env.error, response)
      }).finally(function() {
       $ionicLoading.hide()
      });
    }


})
