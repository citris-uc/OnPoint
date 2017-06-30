angular.module('app.controllers')
.controller('profileCtrl', function($scope, Patient, $ionicLoading) {
  $scope.ethnicities = [];
  $scope.genders = [{value: "male", display: "Male"}, {value: "female", display: "Female"}]

  $scope.patient = {};


  $ionicLoading.show({hideOnStateChange: true})

  Patient.getFromFirebase().then(function(patient) {
    $scope.patient = patient
  }).catch(function(res) {
    $scope.$emit(onpoint.error, res)
  }).finally(function() {
    $ionicLoading.hide()
  })

  $scope.update = function() {
    $ionicLoading.show({hideOnStateChange: true})

    Patient.saveAndSync($scope.patient).then(function() {
      $ionicLoading.hide()
    }).catch(function(res) {
      $ionicLoading.hide()
      $scope.$emit(onpoint.error, res)
    })
  }
})
