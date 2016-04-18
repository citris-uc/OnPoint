angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, MeasurementSchedule, MedicationHistory) {
  $scope.cards = Card.getByDay(new Date());
  $scope.CARD = CARD;
  $scope.medSchedule = MedicationSchedule.get()
  $scope.medHistory  = MedicationHistory.getTodaysHistory()
  $scope.medications        = Medication.get();
  $scope.today       = new Date();

  // TODO: Remove this inefficiency by moving the update/complete logic to the
  // appropriate factory.
  for(var i = 0; i < $scope.cards.length; i++) {
    var card = $scope.cards[i];
    Card.checkCardUpdate(card);
    Card.checkCardComplete(card);
  }

  //TODO: use this to trigger generating all scheduled cards per day.
  $scope.$on('$ionicView.enter', function(){
    var today = (new Date()).toISOString().substring(0,10)
    var todaysCardReq = Card.ref().child(today).once("value", function (snap) { //only do this once per day
      if (!snap.exists()) {
        MedicationSchedule.createTodaysCards();
        //TODO: need to add measurementSchedule
      }
    }) //end todaysCard Req

  });

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
  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   */
  $scope.getBody = function(card, type, index) {
    switch(type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        var schedule = $scope.medSchedule[index]
        var medications = schedule.medications;
        var takeMeds = [];
        var skippedMeds = [];
        var completedMeds = [];

        // Check history for each medication in the specified schedule
        // TODO: Refactor this to query against a MedicationHistory array.
        medications.forEach( function(medication) {
          var med = {}
          //Find the Med
          for(var i = 0; i < $scope.medications.length; i++) {
            if ($scope.medications[i].trade_name == medication) {
              med = $scope.medications[i]
              med.id = $scope.medications[i].$id;
            }
          }

          var exists = false;
          for(var i = 0; i < $scope.medHistory.length; i++) {
            var hist = $scope.medHistory[i];
            if (hist.medication_id==med.id && hist.medication_schedule_id==schedule.$id) {
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

  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   * TODO: fix other categories
   */
  $scope.openPage = function(card, type, index){
    switch(type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        // Take Medications --> Show Schedule
        // Get schedule associated with card
        var schedule = $scope.medSchedule[index]
        action = {tab: 'tabsController.medicationsSchedule', params: {schedule_id: schedule.$id}};
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

  //TODO: Move creating ALL cards to '$ionicView.enter'
  // $scope.generateCardsForToday = function() {
  //  var measurementSchedule = MeasurementSchedule.get()
  //  measurementSchedule.$loaded().then( function(ref) {
  //    for(var i = 0; i < measurementSchedule.length; i++) {
  //      schedule = measurementSchedule[i];
  //
  //      if (schedule.days.includes($scope.today.getDay())) {
  //        var showAt = (new Date()).setHours(schedule.hour, schedule.minute);
  //        showAt     = (new Date(showAt)).toISOString();
  //
  //        var cardObject = {type: CARD.TYPE.ACTION, shown_at: showAt};
  //        Card.find_or_create_by_object({id: schedule.$id, type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE}, cardObject);
  //      }
  //
  //      $scope.cards = Card.get();
  //    }
  //  });
  // }

  // TODO: Comments should be part of a Card.
  $scope.getCommentsCount = function(card_id){
    return Comment.get_comments_count_by_id(card_id);
  }

  $scope.swipeCard = function(card) {
    if (card.completed_at != null) {
      Card.archive(card.id);
    }
  }

})
