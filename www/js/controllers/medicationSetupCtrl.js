angular.module('app.controllers')

.controller('medInputCtrl', function($scope, $state, $ionicPopup, $templateCache, $ionicPopover, Medication) {
    $scope.medications = Medication.get();
    $scope.newMedication = {};

    $scope.medSelected= function(med) {
      console.log(med)
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
      else if (!$scope.newMedication.dosage)
        displayAlert("Dosage can't be blank");
      else if (!$scope.newMedication.regimen)
        displayAlert("Regimen can't be blank");
      else if (!$scope.newMedication.instructions)
        displayAlert("Instructions can't be blank");
      else if (!$scope.newMedication.purpose)
        displayAlert("Purpose can't be blank");
      else {
        firebaseRecord['dose'] = $scope.newMedication.dosage
        firebaseRecord['regimen'] = $scope.newMedication.regimen
        firebaseRecord['instructions'] = $scope.newMedication.instructions
        firebaseRecord['purpose'] = $scope.newMedication.purpose
        firebaseRecord['notes'] = typeof($scope.newMedication.notes)==='undefined' ? null : $scope.newMedication.notes;
        firebaseRecord['user_input'] =  true
        $scope.medications.$save(firebaseRecord).then(function() {
          $state.go('carePlan.medicationSchedules');
        })
      }
    };


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
   $scope.$on('$ionicView.afterEnter', function(){
     var ref = Patient.ref();
     var req = ref.child('onboarding').update({'state':$state.current.name})
    });
})

.controller('medInputMainCtrl', function($scope, Medication) {
})

.controller('medFillMainCtrl', function($scope, MedicationSchedule, Medication, MedicationDosage) {
  $scope.medicationSchedule = MedicationSchedule.get();
  $scope.medications = Medication.get();
  $scope.emptySlots = [' ',' ',' ',' ',' ',' ',' ']; //array of empty strings to intialize table.
  $scope.completed = []
  $scope.currentMed;

  $scope.getSlots = function(schedule, med) {
    var DAYS_OF_THE_WEEK = 7
    var slots = [];
    if (typeof(med) === 'undefined') {
      slots = [' ',' ',' ',' ',' ',' ',' '];
    }
    else {
      if(schedule.medications.indexOf(med.trade_name) != -1) {
        for(var day = 0; day < DAYS_OF_THE_WEEK; day++) {
          if (schedule.days.indexOf(day) != -1) {
            slots.push(med.tablets);
          } else {
            slots.push(" ");
          }
        }
      }
      else {
        slots = [' ',' ',' ',' ',' ',' ',' '];
      }
    }
    return slots
  }
  $scope.displaySchedule = function(med){
    $scope.currentMed=med
    if(completed.indexOf(med) == -1){
      completed.push(med);
    }
  }

  $scope.hasCompleted = function(med){
    if($scope.completed.indexOf(med) == -1){
      return false;
    }else{
      return true;
    }
  }

})
