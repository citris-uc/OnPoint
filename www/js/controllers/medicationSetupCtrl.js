angular.module('app.controllers')

.controller('medInputCtrl', function($scope, $state, $ionicPopup, $templateCache, Medication) {
    $scope.newMedication = {};
    $scope.save = function(){
      var message;
      if( typeof $scope.newMedication === 'undefined'){
        message = "Input cannot be null";
      }else{
        if(typeof $scope.newMedication.name === 'undefined'){
          message += " name, ";
        }
        if(typeof $scope.newMedication.dosage === 'undefined'){
          message += " dosage, ";
        }
        if(typeof $scope.newMedication.timing === 'undefined'){
          message += " timing, ";
        }
        if(typeof $scope.newMedication.instructions  === 'undefined'){
          message += " instruction, ";
        }
        if(typeof $scope.newMedication.purpose  === 'undefined'){
          message += " purpose, ";
        }
      }
      if(message != null){
        var myPopup = $ionicPopup.show({
          title: "Invalid input",
          subTitle: message,
          scope: $scope,
          buttons: [
            {text: '<b>OK</b>'}
          ]
        });
      }else{
         Medication.add_inputMed($scope.newMedication);
         $state.go('carePlan.medicationSchedules');
      }

    };
})


.controller('medListCtrl', function($scope, Medication) {
   $scope.Scheduledmedications = Medication.get_inputList();
   $scope.test = Medication.get_inputList();
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
