angular.module('app.controllers')
.controller('profileCtrl', function($scope, Participant, $ionicLoading, $cordovaCamera) {
  $scope.patient = {};

  Patient.getFromCloud().then(function(patient) {
    $scope.ethnicities = patient.ethnicities
    $scope.genders     = patient.genders
    if (patient.born_at)
      patient.born_at = new Date(patient.born_at)

    $scope.patient = patient
  }).catch(function(err) {
    $scope.$emit(clovi.env.error, res)
  })

  $scope.update = function() {
    $ionicLoading.show({hideOnStateChange: true})

    Patient.update($scope.patient).catch(function(res) {
      $scope.$emit(clovi.env.error, res)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
