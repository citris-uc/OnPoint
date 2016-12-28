angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicPopup,$ionicHistory, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {

  // TODO --> use MedicationSchedule and FB
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.schedule = MedicationSchedule.get();
  $scope.selected_med = null;
  $scope.slot = {days:[true, true, true, true, true, true, true]};
  $scope.showError = false;

  //Saving State of onboarding progress into firebase
  // $scope.$on('$ionicView.beforeEnter', function(){
  //   var ref = Patient.ref();
  //   var req = ref.child('onboarding').update({'state':$state.current.name})
  //  });

  $scope.$on("$ionicView.loaded", function() {
    if ($scope.schedule.length == 0) {
      MedicationSchedule.setDefaultSchedule()
    }
  })

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
    ampm = (hours >= 12) ? "PM" : "AM";
    hours = (hours > 12) ? hours - 12 : hours;
    newtime = hours + ":" + mins + " " + ampm;
    return newtime;
  }

  $scope.saveMedicationSchedule = function() {
    for(var i = 0; i < $scope.schedule.length; i++) {
      $scope.schedule.$save($scope.schedule[i]);
    }
    //TODO: when editing new schedule need to createa  new schedule in FB, set obj_id to the old schedule id or new one?
    var oldScheduleRef = 'default';
    Card.createAdHoc(CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE, oldScheduleRef, (new Date()).toISOString())

    //Done onboarding!
    var ref = Patient.ref();
    var req = ref.child('medication_scheduling').update({'completed':true})
    $state.go("medication_scheduling.fill_pillbox");


  }
})


.controller('newMedicationScheduleSlotCtrl', function($scope, $state, $ionicPopup,$ionicHistory, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {

  // TODO --> use MedicationSchedule and FB
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.schedule = MedicationSchedule.get();
  $scope.slot = {days:[true, true, true, true, true, true, true]};
  $scope.showError = false;
  console.log($scope.schedule)


  // Show popup when user clicks on + Add Time Slow
  // Allow user to input new name for timeslot
  // TODO -- allow user to pick days of the week for schedule
  $scope.addTimeSlot = function() {
    //console.log("$ionicHistory.currentStateName(): " + $ionicHistory.currentStateName());
    if ($scope.slot.name && $scope.slot.time) {
      hours = $scope.slot.time.getHours();
      mins  = $scope.slot.time.getMinutes();
      hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) )
      mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) )
      var timeStr = hours + ":" + mins;
      var req = MedicationSchedule.addTimeSlot($scope.slot.name, $scope.slot.days, timeStr);

      // Create a new Card for the new time slot
      req.then(function(snapshot) {
        var today = new Date();
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var obj = {time: timeStr, days: $scope.slot.days};

        Card.createFromSchedSlot(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), obj, today.toISOString());
        Card.createFromSchedSlot(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), obj, tomorrow.toISOString());
      })

      // Navigate to the correct page
      $state.go("medication_scheduling.start");
    } else {
      $ionicPopup.show({
        title: "Invalid input",
        subTitle: "You have to enter both name and time for the new slot",
        buttons: [{text: 'OK'}]
      });
    }
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
    ampm = (hours >= 12) ? "PM" : "AM";
    hours = (hours > 12) ? hours - 12 : hours;
    newtime = hours + ":" + mins + " " + ampm;
    return newtime;
  }

  $scope.saveMedicationSchedule = function() {
    for(var i = 0; i < $scope.schedule.length; i++) {
      $scope.schedule.$save($scope.schedule[i]);
    }
    //TODO: when editing new schedule need to createa  new schedule in FB, set obj_id to the old schedule id or new one?
    var oldScheduleRef = 'default';
    Card.createAdHoc(CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE, oldScheduleRef, (new Date()).toISOString())
    if($ionicHistory.currentStateName() == 'medication_scheduling.start') {
      //Done onboarding!
      var ref = Patient.ref();
      var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})
      $state.go("carePlan.fillChoice");
    } else if ($ionicHistory.currentStateName() == 'tabsController.editMedSchedule'){
      $state.go("tabsController.medications");
    }
  }
})


.controller('editMedicationScheduleSlotCtrl', function($scope, $state, $ionicPopup, $ionicHistory, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.slot = MedicationSchedule.findByID($state.params.id);


  $scope.formatTimeObj = function(timestring) {
    var hour = timestring.substring(0,2);
    var mins = timestring.substring(3,5);
    var date = new Date();
    date.setHours(hour);
    date.setMinutes(mins);
    return date;
  }

  $scope.$watch("slot.time", function(newValue, oldValue) {
    console.log(newValue)
    if (newValue && typeof(newValue) == "string")
      $scope.slot.time = $scope.formatTimeObj(newValue)
  })

  $scope.timeDisplayFormat = function(timestring) {
    [hours, mins] = timestring.split(':');
    hours = parseInt(hours);
    ampm = (hours >= 12) ? "PM" : "AM";
    hours = (hours > 12) ? hours - 12 : hours;
    newtime = hours + ":" + mins + " " + ampm;
    return newtime;
  }

  $scope.update = function() {
    // $scope.slot.days = slot.days;
    // $scope.slot.time = $scope.formatTimeObj($scope.slot.time);

    if (!$scope.slot.name)
      alert("Name can't be blank")
    if (!$scope.slot.time)
      alert("Time can't be blank")


    // TODO -> allow user to pick dates for schedule
    // hours = $scope.slot.time.getHours();
    // mins  = $scope.slot.time.getMinutes();
    // hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) );
    // mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) );
    // $scope.schedule[index].slot = $scope.slot.text;
    // $scope.schedule[index].days = $scope.slot.days;
    // $scope.schedule[index].time = hours + ":" + mins;
    var req = $scope.slot.$save($scope.slot);
    req.then(function(snapshot) {
      var today    = new Date();
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.slot, today.toISOString());
      Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.slot, tomorrow.toISOString());
      $ionicHistory.goBack()
    })
  }


  $scope.saveMedicationSchedule = function() {
    for(var i = 0; i < $scope.schedule.length; i++) {
      $scope.schedule.$save($scope.schedule[i]);
    }
    //TODO: when editing new schedule need to createa  new schedule in FB, set obj_id to the old schedule id or new one?
    var oldScheduleRef = 'default';
    Card.createAdHoc(CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE, oldScheduleRef, (new Date()).toISOString())
    if($ionicHistory.currentStateName() == 'medication_scheduling.start') {
      //Done onboarding!
      var ref = Patient.ref();
      var req = ref.child('onboarding').update({'completed':true,'state':$state.current.name})
      $state.go("carePlan.fillChoice");
    } else if ($ionicHistory.currentStateName() == 'tabsController.editMedSchedule'){
      $state.go("tabsController.medications");
    }
  }
})



.controller('medImgCtrl', function($scope, Medication) {
  $scope.medications = Medication.get();

  $scope.getMedImg = function(trade_name) {
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == trade_name) {
        // return ("img/" + $scope.medications[i].img);
        return "img/pill_small.png"
      }
    }
    // Default Image
    return "img/pill_small.png";
  }

})


.controller('medFillMainCtrl', function($scope, $state, $ionicHistory, MedicationSchedule, Medication, MedicationDosage) {
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

  $scope.doneMedSetup =  function() {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
    $state.go('carePlan.setup');
  }

})
