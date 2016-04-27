angular.module('app.controllers')

.controller('medInputCtrl', function($scope, $state, $ionicPopup, $templateCache, $ionicPopover, Medication) {
    $scope.medications = Medication.get();
    $scope.newMedication = {};

    $scope.medSelected = function(med) {
      $scope.newMedication.dose = med.dose;
      $scope.newMedication.instructions = med.instructions;
      $scope.newMedication.purpose = med.purpose;
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

    $scope.saveMedication = function(firebaseRecord){
      if (!$scope.newMedication.name)
        displayAlert("Medication name can't be blank");
      else if (!$scope.newMedication.dose)
        displayAlert("Dosage can't be blank");
      else if (!$scope.newMedication.instructions)
        displayAlert("Instructions can't be blank");
      else if (!$scope.newMedication.purpose)
        displayAlert("Purpose can't be blank");
      else {
        firebaseRecord['instructions'] = $scope.newMedication.instructions
        firebaseRecord['dose'] = $scope.newMedication.dose
        firebaseRecord['purpose'] = $scope.newMedication.purpose
        firebaseRecord['notes'] = typeof($scope.newMedication.notes)==='undefined' ? null : $scope.newMedication.notes;
        firebaseRecord['user_input'] =  true
        $scope.medications.$save(firebaseRecord).then(function() {
          $state.go('carePlan.medicationSchedules');
        })
      }
    };


})


.controller('medicationViewCtrl', function($scope, $stateParams, Medication) {
   $scope.med = Medication.getById($stateParams.medication_id);
})


.controller('medListCtrl', function($scope, $state, Patient, Medication, MedicationSchedule) {
   $scope.scheduledMedications = Medication.get();


   $scope.generate = function() {
     MedicationSchedule.setDefaultSchedule();
     $state.go("carePlan.generatedMedSchedule")
   }

   $scope.scheduledMeds = function() {
     for(var i = 0; i <$scope.scheduledMedications.length; i++ ) {
       if($scope.scheduledMedications[i].user_input)
        return true
     }
     return false
   }

   $scope.disableGenerate = function() {
     for(var i = 0; i <$scope.scheduledMedications.length; i++ ) {
       if(!$scope.scheduledMedications[i].user_input) {
         console.log("yo")
        return true
      }
     }
     return false
   }

   //Saving State of onboarding progress into firebase
   $scope.$on('$ionicView.beforeEnter', function(){
     var ref = Patient.ref();
     var req = ref.child('onboarding').update({'state':$state.current.name})
    });
})

.controller('medInputMainCtrl', function($scope, Medication) {
})

.controller('medFillMainCtrl', function($scope, $state, $ionicHistory, MedicationSchedule, Medication, MedicationDosage) {
  $scope.medicationSchedule = MedicationSchedule.get();
  $scope.medications = Medication.get();
  $scope.selectedMed;
  var emptySlots = [' ',' ',' ',' ',' ',' ',' '];

  $scope.getSlots = function(schedule, med) {
    var DAYS_OF_THE_WEEK = 7
    var slots = [];
    if (typeof(med) === 'undefined') { //has not selected a med yet
      slots = emptySlots
    }
    else {
      if(schedule.medications.indexOf(med.trade_name) != -1) {
        for(var day = 0; day < 7; day++) {
          if (schedule.days[day]) {
            slots.push(med.tablets);
          } else {
            slots.push(" ");
          }
        }
      }
      else {
        slots = emptySlots //this med is not in this schedule slot
      }
    }
    return slots
  }
  $scope.displaySchedule = function(med){
    $scope.selectedMed = med //set the selected med
  }

  $scope.currentlyOn = function(med){
    if($scope.selectedMed == med){
      return true;
    }
    return false;
  }

  $scope.doneMedSetup =  function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
    $state.go('carePlan.setup');
  }

})
