angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, Measurement, MeasurementSchedule, MedicationHistory) {

  // See
  // http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event. Essentially,
  // we avoid stale data.
  $scope.$on('$ionicView.enter', function(){
    $scope.cards = Card.getByDay(new Date());
    $scope.CARD = CARD;
    $scope.medSchedule = MedicationSchedule.get()
    $scope.medHistory  = MedicationHistory.getTodaysHistory()
    $scope.medications = Medication.get();
    $scope.today       = new Date();
    $scope.numComments = new Array($scope.cards.length)
    $scope.measurementSchedule = MeasurementSchedule.get();
    $scope.measHistory = Measurement.getTodaysHistory(); // Measurement History

    // TODO: Remove this inefficiency by moving the update/complete logic to the
    // appropriate factory.
    for(var i = 0; i < $scope.cards.length; i++) {
      var card = $scope.cards[i];
      Card.checkCardUpdate(card);
      Card.checkCardComplete(card);
    }

    var today = (new Date()).toISOString().substring(0,10)
    var todaysCardReq = Card.ref().child(today).once("value", function (snap) { //only do this once per day
      if (!snap.exists()) {
        MedicationSchedule.createTodaysCards();
        MeasurementSchedule.createTodaysCards();
        //TODO: need to do apointments  and goals?
      }
    }) //end todaysCard Req


   });

  $scope.checkCardComplete = function(card) {
    switch(card.object_type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        if (card.completed_at != null || card.archived_at != null) return;
        var schedule;
        for (var i = 0; i < $scope.medSchedule.length; i++) {
          if ($scope.medSchedule[i].$id == card.object_id) {
            schedule = $scope.medSchedule[i];
          }
        }
        if (schedule == null) return;
        var medications = schedule.medications;
        var now    = (new Date()).toISOString();
        var takeMeds = [];
        var skippedMeds = [];
        var completedMeds = [];

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
              else {
                takeMeds.push(med);
              }
            }
          }
          if (!exists)
            takeMeds.push(med);
        })
        if (takeMeds.length == 0) {
          Card.complete(card);
        }
        break;
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
        if (card.completed_at != null || card.archived_at != null) return;
        var schedule;
        for (var i = 0; i < $scope.measurementSchedule.length; i++) {
          if ($scope.measurementSchedule[i].$id == card.object_id) {
            schedule = $scope.measurementSchedule[i];
          }
        }
        if (schedule == null) return;
        var measurements = schedule.measurements;
        var now    = (new Date()).toISOString();
        var incompleteMeas = [];
        var completedMeas = [];
        measurements.forEach( function(meas) {
          var exists = false;
          for(var i = 0; i < $scope.measHistory.length; i++) {
            var hist = $scope.measHistory[i];

            if (hist.measurement_schedule_id==schedule.$id) {
              exists = true;
              if(typeof(hist[meas]) === null)
                incompleteMeas.push(meas);
              else {
                completedMeas.push(meas);
              }
            }
          }
          if (!exists)
            incompleteMeas.push(meas);
        })
        if (incompleteMeas.length == 0) {
          Card.complete(card);
        }
        break;
      default:
        break;
    }
  }

  $scope.getCardStatus = function(card) {
    this.checkCardComplete(card);
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

  $scope.formatStr = function(str) {
    var fstr = str.replace(/_/g, " ");
    fstr = fstr.charAt(0).toUpperCase() + fstr.slice(1);
    return fstr;
  }

  $scope.formatTitle = function(str) {
    var fstr = str.replace("_schedule","");
    fstr = fstr.charAt(0).toUpperCase() + fstr.slice(1);
    return fstr;
  }

  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   */
  $scope.getBody = function(card, type) {
    switch(type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        var schedule;
        for (var i = 0; i < $scope.medSchedule.length; i++) {
          if ($scope.medSchedule[i].$id == card.object_id) {
            schedule = $scope.medSchedule[i];
          }
        }
        if (schedule == null) return;

        // var schedule = $scope.medSchedule[index];
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
              else {
                takeMeds.push(med);
              }
            }
          }
          if (!exists) takeMeds.push(med);

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
        var schedule;
        var measurementString = "Take: ";

        for (var i = 0; i < $scope.measurementSchedule.length; i++) {
          if ($scope.measurementSchedule[i].$id == card.object_id) {
            schedule = $scope.measurementSchedule[i];
          }
        }
        if (schedule == null) return;

        // TODO -> figure out if measurements are completed when Measurements History is implemented
        var measurements  = schedule.measurements;
        var i = 0;
        measurements.forEach( function(meas) {
          if (i > 0) measurementString += ",";
          measurementString += " " + $scope.formatStr(meas);
          i++;
        });

        return [measurementString];
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
        var schedule;
        for (var i = 0; i < $scope.medSchedule.length; i++) {
          if ($scope.medSchedule[i].$id == card.object_id) {
            schedule = $scope.medSchedule[i];
          }
        }
        // Take Medications --> Show Schedule
        // Get schedule associated with card
        //var schedule = $scope.medSchedule[index]
        action = {tab: 'tabsController.medicationsSchedule', params: {schedule_id: schedule.$id}};
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE:
        var schedule;
        for(var i = 0; i < $scope.measurementSchedule.length; i++) {
          if($scope.measurementSchedule[i].$id == card.object_id) {
            schedule = $scope.measurementSchedule[i];
          }
        }
        action = {tab: 'tabsController.measurementAction', params: {schedule_id: schedule.$id}}
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

  $scope.shouldDisplayCard = function(card, timestamp) {
    return true;
    //TODO: Fix this
    var cardDate = new Date(timestamp);
    var now      = new Date();
    if (cardDate.toDateString() == now.toDateString() && cardDate.toTimeString() <= now.toTimeString())
      return true;
    return false;
  }


  $scope.swipeCard = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }

})
