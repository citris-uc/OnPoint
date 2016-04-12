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
        firebaseRecord['notes'] = $scope.newMedication.notes
        firebaseRecord['user_input'] =  true
        $scope.medications.$save(firebaseRecord).then(function() {
          $state.go('carePlan.medicationSchedules');
        })
      }
    };


})


.controller('medListCtrl', function($scope, $state, Medication, MedicationSchedule) {
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

   //Saving State of onboarding progress into firebase
   $scope.$on('$ionicView.afterEnter', function(){
     var ref = Patient.ref();
     var req = ref.child('onboarding').update({'state':$state.current.name})
    });
})

.controller('medInputMainCtrl', function($scope, Medication) {
})

.controller('medFillMainCtrl', function($scope, MedicationSchedule, Medication, MedicationDosage) {
  var medShedule = MedicationSchedule.get();
  var sheduledMed = [];
  $scope.meds = Medication.get_all_med_trade_name();
  console.log(medShedule[0].medications.name);
  $scope.slots = [];

  for(var i = 0; i < medShedule.length; i++){
    $scope.slots[i] = [];
    $scope.slots[i].push(medShedule[i].slot);
    for(var j = 0; j < 7; j++){
        $scope.slots[i].push(" ");
    }
  }

  $scope.displayShedule = function(med){
    var contains = false;
    for(var i = 0; i < medShedule.length; i++){
      for(var j = 0; j < medShedule[i].medications.length; j++){
        if(medShedule[i].medications[j].trade_name == med){
          contains = true;
        }
      }
      if(contains){
        var med_name = Medication.get_name_by_trade_name(med);
        var tablets = MedicationDosage.getByName(med_name).tablets;
        for(var k = 0; k < medShedule[i].days.length; k++){
          $scope.slots[i][medShedule[i].days[k] + 1] = "" + tablets;
        }
      }else{
        for(var k = 0; k < medShedule[i].days.length; k++){
          $scope.slots[i][medShedule[i].days[k] + 1] = "0";
        }
      }
    }
    if(sheduledMed.indexOf(med) == -1){
      sheduledMed.push(med);
    }
  }

  $scope.isSheduledlist = function(med){
    if(sheduledMed.indexOf(med) == -1){
      return false;
    }else{
      return true;
    }
  }

})
