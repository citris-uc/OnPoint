angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, Medication, MedicationSchedule, MedicationHistory) {
  $scope.schedule           = MedicationSchedule.get();
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();

  $scope.didTakeMed = function(medication, schedule) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(medication, schedule) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }
})

.controller("medicationScheduleCtrl", function($scope, $stateParams, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);

  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();

  $scope.didTakeMed = function(medication) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(medication) {
    var match;
    var med = Medication.getByTradeName(medication)
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }
})

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByTradeName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
    req.then(function(ref) {
      var alertPopup = $ionicPopup.alert({
        title: 'Success',
        template: 'You have succesfully taken ' + $scope.medication.trade_name
      });

      alertPopup.then(function(res) {
        $ionicHistory.goBack();
      });
    })
  }

  $scope.skipMedication = function()  {
    var myPopup = $ionicPopup.show({
      subTitle: 'Are you sure you want to skip ' + $scope.medication.trade_name,
      scope: $scope,
      buttons: [
        { text: 'No' },
        {
          text: '<b>Yes</b>',
          onTap: function(e) {
            var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "skip");
            req.then(function(ref) { $ionicHistory.goBack();});          }
        }
      ]
    });
  };
})

.controller('medicationsSettingCtrl', function($scope, $state, $ionicPopup, Patient, Medication, MedicationSchedule, MedicationHistory) {

  // TODO --> use MedicationSchedule and FB
  $scope.schedule = MedicationSchedule.get();
  $scope.selected_med = null;
  $scope.newSlotName = {text: ""};
  $scope.showError = false;

  //Saving State of onboarding progress into firebase
  $scope.$on('$ionicView.afterEnter', function(){
    var ref = Patient.ref();
    var req = ref.child('onboarding').update({'state':$state.current.name})
   });

  $scope.sortSchedule = function() {
    $scope.schedule.sort(function(a, b){var dat1 = a.time.split(":"); var dat2 = b.time.split(":");
                            return parseInt(dat1[0]+dat1[1]) - parseInt(dat2[0]+dat2[1])});
  }

  $scope.dropCallback = function(event, index, item, external, type, allowedType, list, listnull) {
      // Check if medications list exists.  If not, create it.
      if (listnull) {
        list.medications = [];
      }
      // Check if med exists in medications array - if exists, prevent drop
      for (var i = 0; i < list.medications.length; i++) {
        if (list.medications[i] == item) return false;
      }
      if (external) {
          if (allowedType === 'itemType' && !item.label) return false;
          if (allowedType === 'containerType' && !angular.isArray(item)) return false;
      }
      return item;
  };

  // Show popup when user clicks on + Add Time Slow
  // Allow user to input new name for timeslot
  // TODO -- allow user to pick days of the week for schedule
  $scope.addTimeSlot = function() {
    var myPopup = $ionicPopup.show({
      templateUrl: 'medSched-popup-template.html',
      title: 'Add a time slot',
      subTitle: 'Enter new time slot name',
      attr:'data-ng-disabled=""!newSlotName.text"',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Add</b>',
          onTap: function(e) {
            // Make sure input field contains text.
            if ($scope.newSlotName.text) {
              // TODO -> allow user to pick dates for schedule
              MedicationSchedule.addTimeSlot($scope.newSlotName.text, [0,1,2,3,4,5,6]);
              $scope.newSlotName.text = "";
              $scope.showError = false;
            } else {
              e.preventDefault();
              $scope.showError = true;

            }
          }
        }
      ]
    });
  }

  $scope.saveMedicationSchedule = function() {
    for(var i = 0; i < $scope.schedule.length; i++) {
      $scope.schedule.$save($scope.schedule[i]);
    }
    //Done onboarding!
    var ref = Patient.ref();
    var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})
    $state.go("carePlan.fillChoice")
  }
})
