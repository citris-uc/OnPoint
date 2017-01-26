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

// TODO: Implement once we have RxNorm. See #516
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


.controller('medicationMatchCtrl', function($scope, $state, $ionicPopover, Medication, $ionicLoading, $ionicHistory) {
  $scope.drug       = {}
  $scope.medication = {}

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show()

    Medication.searchByRXCUI($state.params.rxcui).then(function(response) {
      $scope.drug = response.data
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


.controller('medicationViewCtrl', function($scope, $state, Medication, $ionicHistory) {
   $scope.medication = Medication.getById($state.params.id);
   $scope.removeMedication = function() {
     $scope.medication.$remove().then(function(response) {

       $ionicHistory.nextViewOptions({
         disableBack: true,
         historyRoot: true
       })

       $state.go("medication_identification.start")
     }, function(response) {
       $scope.$emit(onpoint.env.error, {error: response})
     })
   }

   $scope.update = function() {
     $scope.medication.$save().then(function(res) {
       $ionicHistory.goBack(-1)
     })
   }
})


.controller('medicationsListCtrl', function($scope, $state, Patient, Medication, MedicationSchedule, Onboarding, $ionicLoading) {
   $scope.scheduledMedications = Medication.get();
   console.log($scope.scheduledMedications)

   $scope.generateDefaultMeds = function() {
     Medication.setDefaultMeds()
     $state.go("medication_identification.start", {}, {reload: true})
   }

   $scope.completeMedicationIdentification = function() {
     $ionicLoading.show({hideOnStateChange: true})
     MedicationSchedule.setDefaultSchedule().then(function(res) {
       $ionicLoading.hide()
       Onboarding.ref().update({'medication_identification':true}).then(function(response) {
         $state.go("medication_scheduling.start")
       })
     }).catch(function(res) {
       $ionicLoading.hide()
     })
   }

   $scope.disableGenerate = function() {
     return ($scope.scheduledMedications.length == 0)
   }
})
