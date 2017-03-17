angular.module('app.controllers')
.controller('profileCtrl', function($scope, Patient, $ionicLoading, $cordovaCamera) {
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

  // $scope.loadCamera = function() {
  //   $cordovaCamera.getPicture({saveToPhotoAlbum: true, destinationType: 0}).then(function(base64) {
  //     $scope.Patient.profile_photo = "data:image/jpeg;base64," + base64
  //     $scope.$apply()
  //   }).catch(function(res) {
  //     $scope.$emit(onpoint.error, res)
  //   })
  // }

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
