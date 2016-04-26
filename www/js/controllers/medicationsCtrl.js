angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, $ionicSlideBoxDelegate,Medication, MedicationSchedule, MedicationHistory) {
  $scope.medicationTab = {pageIndex: 0}
  $scope.schedule           = MedicationSchedule.get();
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();
  $scope.medications        = Medication.get();

  $scope.containCabMeds = function() {
    for(var i = 0; i < $scope.medications.length; i++) {
      if($scope.medications[i].cab_med)
        return true;
    }
    return false
  }

  $scope.slideHasChanged = function(pageIndex) {
    $scope.medicationTab.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $scope.medicationTab.pageIndex = pageIndex;
    $ionicSlideBoxDelegate.slide(pageIndex);
  }

  $scope.didTakeMed = function(medication, schedule) {
    var match;
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.$id) {
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
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == schedule.$id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }

  //THIS IS FOR FILLING PILL BOX. IS THERE A BETTER WAY?
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

})

.controller("medicationScheduleCtrl", function($scope, $state, $stateParams, $ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule = MedicationSchedule.findByID($stateParams.schedule_id);
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();
  $scope.medications        = Medication.get();

  $scope.didTakeMed = function(medication) {
    var match;
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
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
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
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

  /*
   * Can get to templates/medications/schedule.html in 2 ways so need to direct approrpiately when click a specific med
   * rather than having a hard coded ui-sref like below
   * ui-sref="tabsController.medicationAction({schedule_id: schedule.$id, medication_name: med})"
   * ui-sref="tabsController.medication({schedule_id: schedule.$id, medication_name: med})"
   */
  $scope.directToMed = function(schedule, med_name) {
    var params =  {schedule_id: schedule, medication_name: med_name};

    if($ionicHistory.backView().stateName=='tabsController.timeline')
      $state.go('tabsController.medicationAction',params)
    else if ($ionicHistory.backView().stateName=='tabsController.medications')
      $state.go('tabsController.medication',params)

  }

  $scope.takeAll = function(){
    for(var i = 0; i < $scope.schedule.medications.length; i++){
      if(this.didTakeMed($scope.schedule.medications[i]) == false){
        var req = Medication.getByTradeName($scope.schedule.medications[i])
        req.then(function(snapshot) {
          $scope.medication = snapshot.val()
          $scope.medication["id"] =  snapshot.key()
           var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
        })
      }
    }
    $ionicHistory.goBack();
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
  $scope.containMeds = function(){
    if( typeof $scope.schedule.medications === "undefined"){
      return false;
    }
    for(var i = 0; i < $scope.schedule.medications.length; i++ ) {
      if(this.didTakeMed($scope.schedule.medications[i]) == false){
        return true;
      }
    }
    return false;
  }
})

.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  var req = Medication.getByTradeName($stateParams.medication_name)
  req.then(function(snapshot) {
    $scope.medication = snapshot.val()
    $scope.medication["id"] =  snapshot.key()
  })
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


.controller("cabMedTakeCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.cabMed = {};
  console.log($scope.state)
  var req = Medication.getByTradeName($stateParams.medication_name)
  req.then(function(snapshot) {
    $scope.medication = snapshot.val()
    $scope.medication["id"] =  snapshot.key()
  })
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    console.log($scope.medication)
    console.log($scope.schedule)
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

})

.controller('medicationEditCtrl', function($scope, $stateParams, $ionicHistory, Medication) {
   $scope.med = Medication.getById($stateParams.medication_id);
   $scope.update = function(){
       $scope.med.$save();
       $ionicHistory.goBack();
   }
})

.controller('medicationsSettingCtrl', function($scope, $state, $ionicPopup,$ionicHistory, $firebaseObject, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {

  // TODO --> use MedicationSchedule and FB
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.schedule = MedicationSchedule.get();
  $scope.selected_med = null;
  $scope.slot = {days:[false, false, false, false, false, false, false]};
  $scope.showError = false;

  //Saving State of onboarding progress into firebase
  $scope.$on('$ionicView.beforeEnter', function(){
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
    //console.log("$ionicHistory.currentStateName(): " + $ionicHistory.currentStateName());
    if ($scope.slot.text && $scope.slot.time) {
      hours = $scope.slot.time.getHours();
      mins  = $scope.slot.time.getMinutes();
      hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) )
      mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) )
      //console.log("Add Name:  " + $scope.slot.text + " days: " + $scope.slot.days);
      var req = MedicationSchedule.addTimeSlot($scope.slot.text, $scope.slot.days, hours + ":" + mins);

      req.then(function(snapshot) {
        var obj = {time: hours + ":" + mins, days: $scope.slot.days};
        Card.createFromSchedSlot(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), obj, new Date().toISOString());
      })

      if ($ionicHistory.currentStateName() == 'carePlan.newSlot') {
        $state.go("carePlan.generatedMedSchedule");
      }
      if ($ionicHistory.currentStateName() == 'tabsController.newScheduleSlot') {
        $state.go("tabsController.editMedSchedule");
      }
    } else {
      $ionicPopup.show({
        title: "Invalid input",
        subTitle: "You have to enter both name and time for the new slot",
        buttons: [{text: 'OK'}]
      });
    }
  }

  $scope.editSlot = function(slot) {
    var index = $scope.schedule.indexOf(slot);
    $scope.slot.text = slot.slot;
    $scope.slot.idx  = index;
    $scope.slot.days = slot.days;
    $scope.slot.time = $scope.formatTimeObj(slot.time);

    var myPopup = $ionicPopup.show({
      templateUrl: 'medSched-popup-template.html',
      title: 'Edit time slot',
      subTitle: 'Enter new time slot name and reminder time',
      attr:'data-ng-disabled=""!newSlotName.text"',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          onTap: function(e) {
            // Make sure input field contains text.
            if ($scope.slot.text && $scope.slot.time) {
              // TODO -> allow user to pick dates for schedule
              hours = $scope.slot.time.getHours();
              mins  = $scope.slot.time.getMinutes();
              hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) );
              mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) );
              $scope.schedule[index].slot = $scope.slot.text;
              $scope.schedule[index].days = $scope.slot.days;
              $scope.schedule[index].time = hours + ":" + mins;
              //$scope.schedule.$save($scope.schedule[index]);
              $scope.slot.text = "";
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

  $scope.formatTimeObj = function(timestring) {
    var hour = timestring.substring(0,2);
    var mins = timestring.substring(3,5);
    var date = new Date();
    date.setHours(hour);
    date.setMinutes(mins);
    return date;
  }

  $scope.timeDisplayFormat = function(timestring) {
    [hours, mins] = timestring.split(':');
    hours = parseInt(hours);
    ampm = (hours > 12) ? "PM" : "AM";
    hours = (hours > 12) ? hours - 12 : hours;
    newtime = hours + ":" + mins + " " + ampm;
    return newtime;
  }

  $scope.saveMedicationSchedule = function() {
    for(var i = 0; i < $scope.schedule.length; i++) {
      $scope.schedule.$save($scope.schedule[i]);
    }
    if($ionicHistory.currentStateName() == 'carePlan.generatedMedSchedule') {
      //Done onboarding!
      var ref = Patient.ref();
      var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})
      $state.go("carePlan.fillChoice");
    } else if ($ionicHistory.currentStateName() == 'tabsController.editMedSchedule'){
      $state.go("tabsController.medications");
    }
  }
})

.controller('cabmedInputCtrl', function($scope, $state, $ionicPopup, $ionicHistory, Medication) {
    $scope.newMedication = {'cab_med':true};

    var displayAlert = function(message) {
      var myPopup = $ionicPopup.show({
        title: "Invalid input",
        subTitle: message,
        scope: $scope,
        buttons: [{text: 'OK'}]
      });
    }

    $scope.saveMedication = function(){
      if (!$scope.newMedication.trade_name)
        displayAlert("Medication name can't be blank");
      else if (!$scope.newMedication.dose)
        displayAlert("Dosage can't be blank");
      else if (!$scope.newMedication.instructions)
        displayAlert("Instructions can't be blank");
      else if (!$scope.newMedication.purpose)
        displayAlert("Purpose can't be blank");
      else {
        console.log("save cab med", $scope.newMedication);
        Medication.add($scope.newMedication);
        $ionicHistory.goBack();
      }
    };

})
