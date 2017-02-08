angular.module('app.controllers')
.controller('newMedicationCtrl', function($scope, $state, $ionicPopup, $ionicHistory, $templateCache, $ionicPopover, Medication, $firebaseObject) {
    $scope.medications = Medication.getDefaultMedications();
    $scope.medication = {};

    $scope.medSelected = function(med) {
      console.log($scope.medication)
      $scope.medication.dose = med.dose;
      $scope.medication.instructions = med.instructions;
      $scope.medication.purpose = med.purpose;
      $scope.medication.notes = med.notes
      console.log(med)
      console.log("inside med selected ");
    }

    var displayAlert = function(message) {
      var myPopup = $ionicPopup.show({
        title: "Invalid input",
        subTitle: message,
        scope: $scope,
        buttons: [{text: 'OK'}]
      });
    }

    $scope.hasRequiredAttributes = function() {
      if (!$scope.medication.name)
        return false;
      if (!$scope.medication.dose)
        return false;
      if (!$scope.medication.instructions)
        return false;
      if (!$scope.medication.purpose)
        return false;
      return true
    }

    $scope.save = function(firebaseRecord){
      if (!$scope.medication.name)
        displayAlert("Medication name can't be blank");
      else if (!$scope.medication.dose)
        displayAlert("Dosage can't be blank");
      else if (!$scope.medication.instructions)
        displayAlert("Instructions can't be blank");
      else if (!$scope.medication.purpose)
        displayAlert("Purpose can't be blank");
      else {
        firebaseRecord = {}
        firebaseRecord["trade_name"]   = $scope.medication.name.trade_name
        firebaseRecord['instructions'] = $scope.medication.instructions
        firebaseRecord['dose'] = $scope.medication.dose
        firebaseRecord['purpose'] = $scope.medication.purpose
        firebaseRecord['notes'] = typeof($scope.medication.notes)==='undefined' ? null : $scope.medication.notes;
        firebaseRecord['user_input'] =  true

        Medication.get().$add(firebaseRecord).then(function(response) {
          console.log(response)
          $ionicHistory.goBack(-2)
        }, function(response) {
          console.log("Error")
          console.log(response)
        })
      }
    };
})
