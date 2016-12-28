angular.module('app.controllers')
.controller('medicationSchedulingCtrl', function($scope, $state, $ionicPopup,$ionicHistory, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {

  // TODO --> use MedicationSchedule and FB
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.schedule = MedicationSchedule.get();
  $scope.selected_med = null;
  $scope.slot = {days:[true, true, true, true, true, true, true]};
  $scope.showError = false;
  console.log($scope.schedule)

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
      var timeStr = hours + ":" + mins;
      //console.log("Add Name:  " + $scope.slot.text + " days: " + $scope.slot.days);
      var req = MedicationSchedule.addTimeSlot($scope.slot.text, $scope.slot.days, timeStr);

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
      //  TODO:
      if ($ionicHistory.currentStateName() == 'carePlan.newSlot') {
        $state.go("medication_scheduling.start");
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
              var req = $scope.schedule.$save($scope.schedule[index]);
              req.then(function(snapshot) {
                var today = new Date();
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.schedule[index], today.toISOString());
                Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.schedule[index], tomorrow.toISOString());
              })
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
