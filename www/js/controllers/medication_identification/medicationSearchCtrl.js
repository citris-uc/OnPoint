
// TODO: Implement once we have RxNorm. See #516
angular.module('app.controllers')
.controller('medicationSearchCtrl', function($scope, $state, Medication, $ionicLoading, Patient, $ionicSlideBoxDelegate, $cordovaCamera) {
    $scope.medication  = {};
    $scope.params      = {noDrugMatch: false};
    $scope.drugs       = [];
    $scope.state       = {pageIndex: 0}
    $scope.ocr_results = {}

    $scope.changeSlide = function(pageIndex) {
      $scope.state.pageIndex = pageIndex;
    }

    $scope.transitionToPageIndex = function(pageIndex) {
      $ionicSlideBoxDelegate.slide(pageIndex);
    }

    $scope.loadCamera = function() {
      $scope.ocr_results = {}
      navigator.notification.alert("When taking a picture, center the picture on the pill label. One image is sufficient.", null)

      $cordovaCamera.getPicture({saveToPhotoAlbum: true, quality: 50, correctOrientation: true, targetHeight: 1000, destinationType: 0}).then(function(base64) {
        $scope.medication.photo = "data:image/jpeg;base64," + base64
      }).catch(function(res) {
        $scope.$emit(clovi.env.error, res)
      })
    }

    $scope.sendToOCR = function() {
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Extracting text...", hideOnStateChange: true})

      Medication.ocr($scope.medication.photo).then(function(res) {
        // console.log("Results from Medication OCR")
        // navigator.notification.alert(JSON.stringify(res), null)
        $scope.ocr_results         = res.data
      }).finally(function() {
        $ionicLoading.hide()
      })
    }

    $scope.navigateToOcrMatch = function() {
      $state.go("medication_identification.ocr_match", {ocr: JSON.stringify($scope.ocr_results)}, {reload: true})
    }

    $scope.search = function() {
      $scope.drugs = []
      $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Searching...", hideOnStateChange: true})

      Medication.search($scope.params.search).then(function(response) {
        $scope.drugs = response.data
        $scope.params.noDrugMatch = ($scope.drugs == 0)
      }).catch(function(response) {
        navigator.notification.alert(JSON.stringify(response), null)
        $scope.$emit(onpoint.env.error, response)
      }).finally(function() {
       $ionicLoading.hide()
      });
    }


})
