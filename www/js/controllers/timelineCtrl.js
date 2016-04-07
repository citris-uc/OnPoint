angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, MeasurementSchedule, MedicationHistory) {
  $scope.cards = Card.getByDay(new Date());
  $scope.CARD = CARD;
  $scope.today; //to keep track of the current date.
  $scope.medSchedule = MedicationSchedule.get()
  $scope.medHistory = MedicationHistory.getTodaysHistory()


  // TODO: Remove this inefficiency by moving the update/complete logic to the
  // appropriate factory.
  for(var i = 0; i < $scope.cards.length; i++) {
    var card = $scope.cards[i];
    Card.checkCardUpdate(card);
    Card.checkCardComplete(card);
  }

  /* This function will return the current date
   * TODO: use this to trigger generating all scheduled cards per day.
   */
  $scope.getDay = function() {
    var today = new Date().toDateString();
    if ($scope.today != today) {
      $scope.today = today
      MedicationSchedule.createTodaysCards();
      console.log("set new date")
    } else  {
      console.log("kept old date")
    }
    return new Date();
  }

  $scope.getCardStatus = function(card) {
    // Return cardClass: urgent/active/completed
    if (card.completed_at == null) {
      if (card.type == CARD.TYPE.URGENT) {
        return "urgentCard";
      } else {
        return "activeCard";
      }
    } else {
      return "completedCard";
    }
  }

  $scope.getTime = function(timestamp) {
    return new Date(timestamp);
  }

  $scope.getBody = function(card, type, index) {
    switch(type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        // Get schedule associated with card
        var schedule = $scope.medSchedule[index]
        var medications = schedule.medications;
        var takeMeds = [];
        var skippedMeds = [];
        var completedMeds = [];

        // Check history for each medication in the specified schedule
        // TODO: Refactor this to query against a MedicationHistory array.
        medications.forEach( function(medication) {
          var med = Medication.getByTradeName(medication);
          var exists = false;
          for(var i = 0; i < $scope.medHistory.length; i++) {
            var hist = $scope.medHistory[i];
            if (hist.medication_id==med.id && hist.medication_schedule_id==index) {
              exists = true;
              if(hist.taken_at != null)
                completedMeds.push(med);
              else if (hist.skipped_at != null)
                skippedMeds.push(med);
            }
          }
          if (!exists)
            takeMeds.push(med);

          // var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
          // if (history == null)
          //   takeMeds.push(med);
          // else if (history.taken_at != null) {
          //   completedMeds.push(med);
          // } else if (history.skipped_at != null) {
          //   skippedMeds.push(med);
          // }
        })

        // Create a string for each line for Take/Skipped/Completed meds
        // TODO -- is there a clean way to do this in the UI to filter?
        //         possible to have different UI templates depending on card category?
        var takeString = takeMeds.length > 0 ? "Take:" : null;
        var skippedString = skippedMeds.length > 0 ? "Skipped:" : null;
        var completedString = completedMeds.length > 0 ? "Completed:" : null;

        takeMeds.forEach( function(med) {
          takeString = takeString + " " + med.trade_name;
        })
        skippedMeds.forEach( function(med) {
          skippedString = skippedString + " " + med.trade_name;
        })
        completedMeds.forEach( function(med) {
          completedString = completedString + " " + med.trade_name;
        })
        return [takeString, skippedString, completedString];
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
        return ["Take <measurements>"];
      case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
        return ["Appointment Information"];
      case CARD.CATEGORY.GOALS :
        return ["View Goals"];
      //case CARD.CATEGORY.SYMPTOMS :
      default:
        return [""];
    } // end switch
  }

  $scope.openPage = function(card){
    var index = $scope.cards.indexOf(card);
    card = $scope.cards[index];

    switch(card.object_type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        // Take Medications --> Show Schedule
        var schedule = MedicationSchedule.findByID(card.object_id);
        action = {tab: 'tabsController.medicationsSchedule', params: {schedule_id: schedule.id}};
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE:
        action = {tab: 'tabsController.measurementAdd', params: {}}
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
        action = {tab: 'tabsController.appointments', params: {}}
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.GOALS :
        action = {tab: 'tabsController.goals', params: {}}
        $state.go(action.tab, action.params);
      default:
        action = {tab: 'tabsController', params: {}}
        return $state.go(action.tab, action.params);
    }
  }

  $scope.shouldDisplayCard = function(timestamp) {
    return true;
    //TODO: Fix this
    var cardDate = new Date(timestamp);
    var now      = new Date();
    if (cardDate.toDateString() == now.toDateString() && cardDate.toTimeString() <= now.toTimeString())
      return true;
    return false;
  }

  // TODO: Deprecate soon as we're moving to Firebase.
  $scope.generateCardsForToday = function() {
   var measurementSchedule = MeasurementSchedule.get();
   var today = new Date();
   var currentDay = today.getDay();

   for(var i = 0; i < measurementSchedule.length; i++) {
     slot = measurementSchedule[i];
     if (slot.days.includes(currentDay)) {
       var cardObject = {type: CARD.TYPE.ACTION};

       time = slot.time.split(":");
       var showAt = (new Date()).setHours(time[0],time[1]);
       showAt = (new Date(showAt)).toISOString();

       cardObject.shown_at = showAt;
       Card.find_or_create_by_object({id: slot.id, type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE}, cardObject);
     }
   }

   $scope.cards = Card.get();
  }

  $scope.getCommentsCount = function(card_id){
    return Comment.get_comments_count_by_id(card_id);
  }

  $scope.swipeCard = function(card) {
    if (card.completed_at != null) {
      Card.archive(card.id);
    }
  }

})
