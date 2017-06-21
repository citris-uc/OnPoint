
angular.module('app.controllers')
.controller('medicationMatchCtrl', function($scope, $state, Medication, $ionicLoading, $ionicHistory, $ionicModal) {
  $scope.drug  = {units: "tablets"}
  $scope.units           = Medication.units
  $scope.administrations = Medication.administrations
  $scope.frequencies     = Medication.frequencies
  $scope.ocr   = angular.fromJson($state.params.ocr)
  $scope.search = $state.params.search

  $scope.colors = ["#FFFFFF", "#FFFFF0", "#FF5733", "#FFC0CB", "#FFA500", "#FFDAB9", "#FFFE0", "#D2B48C", "#800080", "#D8BFD8", "#2E8B57", "#90EE90", "#00008B", "#ADD8E6", "#000000", "#D3D3D3", "#A0522D"]
  $scope.shapes = ["round", "oblong","oval", "triangle", "5sided", "6sided", "7sided", "8sided", "diamond", "rectangle", "square", "teardrop"]

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading info...", hideOnStateChange: true})

    Medication.searchByRXCUI($state.params.rxcui).then(function(response) {
      $scope.drug = response.data
      $scope.drug.units = "tablets"

      if ($state.params.image)
        $scope.drug.image = $state.params.image

      if (!$scope.drug.nickname)
        $scope.drug.nickname = $state.params.search

      if ($scope.ocr) {
        $scope.drug.dosage = $scope.ocr.amount

        if ($scope.ocr.units)
          $scope.drug.units = $scope.ocr.units

        if ($scope.ocr.frequency && _.contains($scope.frequencies, $scope.ocr.frequency))
          $scope.drug.frequency = $scope.ocr.frequency

        if ($scope.ocr.delivery && _.contains($scope.administrations, $scope.ocr.delivery))
          $scope.drug.administration  = $scope.ocr.delivery

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

    if (!$scope.drug.shape) {
      alert("Please describe the shape of the medication")
      return
    }

    if (!$scope.drug.color) {
      alert("Please describe the color of the medication")
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


  $scope.allowSave = function() {
    if (!$scope.drug.name) {
      return false
    }
    if (!$scope.drug.administration) {
      return false
    }
    if (!$scope.drug.dosage || !$scope.drug.units) {
      return false
    }
    if (!$scope.drug.frequency) {
      return false
    }

    if (!$scope.drug.shape) {
      return false
    }

    if (!$scope.drug.color) {
      return false
    }

    return true;
  }


   $scope.chooseShape = function(shape) {
     $scope.drug.shape = shape
     $scope.closeModal()
   }

   $scope.chooseColor = function(color) {
     $scope.drug.color = color
     $scope.closeModal()
   }


   $scope.closeModal = function() {
     $scope.modal.hide()
   }

   $scope.shapeModal = function(med) {
     // Create the login modal that we will use later
     return $ionicModal.fromTemplateUrl('templates/medications/shape.html', {
       scope: $scope,
       animation: 'slide-in-up',
       focusFirstInput: true,
       backdropClickToClose: false,
       hardwareBackButtonClose: false
     }).then(function(modal) {
       $scope.modal = modal;
       return modal.show()
     })
   }

   $scope.colorModal = function(med) {
     // Create the login modal that we will use later
     return $ionicModal.fromTemplateUrl('templates/medications/color.html', {
       scope: $scope,
       animation: 'slide-in-up',
       focusFirstInput: true,
       backdropClickToClose: false,
       hardwareBackButtonClose: false
     }).then(function(modal) {
       $scope.modal = modal;
       return modal.show()
     })
   }

})
