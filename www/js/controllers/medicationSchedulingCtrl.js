angular.module('app.controllers')

// .controller('medImgCtrl', function($scope, Medication) {
//   $scope.medications = Medication.get();
//
//   $scope.getMedImg = function(trade_name) {
//     for(var i = 0; i < $scope.medications.length; i++) {
//       if ($scope.medications[i].trade_name == trade_name) {
//         // return ("img/" + $scope.medications[i].img);
//         return "img/pill_small.png"
//       }
//     }
//     // Default Image
//     return "img/pill_small.png";
//   }
//
// })

.controller('medFillMainCtrl', function($scope, $state, $ionicHistory, MedicationSchedule, Medication, MedicationDosage, Patient) {
  $scope.medicationSchedule = MedicationSchedule.get();
  $scope.medications = Medication.get();
  $scope.selectedMed;
  var emptySlots = [' ',' ',' ',' ',' ',' ',' '];
  var selectedMed = [];
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
    selectedMed.push(med);
    $scope.selectedMed = med //set the selected med
  }

  $scope.currentlyOn = function(med){
    if($scope.selectedMed == med){
      return true;
    }
    return false;
  }

  $scope.hasSelected = function(med){
    if(selectedMed.indexOf(med) != -1){
      return true;
    }
    return false;
  }

  $scope.buttonStyle = function(med){
    var selected = "background-color: gray";
    var notSelected = "background-color: white";
    var currentlyOn = "background-color: green";
    if($scope.currentlyOn(med)){
      return currentlyOn;
    }
    if($scope.hasSelected(med)){
      return selected;
    }
    return notSelected;
  }

  // $scope.completeMedicationScheduling = function() {
  //   // var medicationIdRef = Patient.ref().child('medication_scheduling');
  //   // medicationIdRef.set({'completed':true}).then(function(response) {
  //   //   $state.go("onboarding.complete")
  //   // })
  //   var medicationIdRef = Patient.ref().child('onboarding');
  //   medicationIdRef.set({'medication_scheduling':true}).then(function(response) {
  //     // $state.go("onboarding.complete")
  //     pat = Patient.get()
  //     pat.onboarding.medication_scheduling = true
  //     Patient.set(pat)
  //
  //     $state.go("onboarding.complete")
  //   })
  // }

})
