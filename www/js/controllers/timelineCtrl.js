angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, Measurement, MeasurementSchedule, MedicationHistory, $ionicSlideBoxDelegate) {
  $scope.timeline = {pageIndex: 0}

  $scope.changeTimeline = function(pageIndex) {
    $scope.timeline.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $ionicSlideBoxDelegate.slide(pageIndex);
  }

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    if ($scope.timeline.pageIndex === 0) {
      $scope.cards = Card.getByDay(new Date());
      var manana = new Date();
      manana.setDate(manana.getDate() + 1);
      $scope.tomorrowCards = Card.getByDay(manana);
    } else {
      $scope.history = Card.getHistory();
    }
    $scope.$broadcast('scroll.refreshComplete');
  }

  /*
   * We store dates in firebase in ISO format which is zero UTC offset
   * therefore we cannot simply display the date that is stored in firebase, we need to display local time
   */
  $scope.setLocaleDate = function(utc_date) {
    var iso = (new Date()).toISOString(); //get current ISO String
    var iso_altered = utc_date.concat(iso.substring(10)); //replace date portion with date from firebase
    var local = new Date(iso_altered); //Date() constructor automatically sets local time!
    return local
  }

  // See
  // http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event. Essentially,
  // we avoid stale data.
  $scope.$on('$ionicView.enter', function(){
    // We load cards and history in one cycle. Any changes will be reflected
    // thanks to Firebase's 3-way data binding.
    $scope.loadCards();
    $scope.history = Card.getHistory();
    $scope.CARD = CARD;
    $scope.medSchedule = MedicationSchedule.get()
    $scope.medHistory  = MedicationHistory.getTodaysHistory()
    $scope.medications = Medication.get();
    $scope.today       = new Date();
    $scope.numComments = new Array($scope.cards.length)
    $scope.measurementSchedule = MeasurementSchedule.get();
    $scope.measHistory = Measurement.getTodaysHistory(); // Measurement History
    var today = (new Date()).toISOString();
    Card.generateCardsFor(today);

    var tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate()+1);
    var tomorrow = tomorrowDate.toISOString();
    Card.generateCardsFor(tomorrow);
  });


  $scope.findMedicationScheduleForCard = function(card) {
    var schedule = null;

    for (var i = 0; i < $scope.medSchedule.length; i++) {
      if ($scope.medSchedule[i].$id == card.object_id) {
        schedule = $scope.medSchedule[i];
      }
    }
    return schedule;
  }

  $scope.findMeasurementScheduleForCard = function(card) {
    var schedule = null;

    for (var i = 0; i < $scope.measurementSchedule.length; i++) {
      if ($scope.measurementSchedule[i].$id == card.object_id) {
        schedule = $scope.measurementSchedule[i];
      }
    }
    return schedule;
  }

  $scope.getMedsStatusArrays = function(schedule, medications, date_key) {
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
      var history_date = $scope.medHistory.$ref().key();

      // If the history reference matches the passed in date then check validity
      if (date_key == history_date) {
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
      }
      if (!exists)
        takeMeds.push(med);
    })
    return {unfinished: takeMeds, skipped: skippedMeds, done: completedMeds};
  }

  $scope.getMeasStatusArrays = function(schedule, measurements, date_key) {
    var incompleteMeas = [];
    var completedMeas = [];

    measurements.forEach( function(meas) {
      var exists = false;
      var history_date = $scope.measHistory.$ref().key();

      // If the history reference matches the passed in date then check validity
      if (date_key == history_date) {
        for(var i = 0; i < $scope.measHistory.length; i++) {
          var hist = $scope.measHistory[i];
          if (hist.measurement_schedule_id==schedule.$id) {
            if(typeof(hist.measurements[meas.name]) != 'undefined') {
              exists= true;
              completedMeas.push(meas.name);
            }
          }
        }  //end historys
      }
      if (!exists) {
        incompleteMeas.push(meas.name);
      }
    })
    return {incomplete: incompleteMeas, complete: completedMeas};
  }

  $scope.checkCardComplete = function(card) {
    switch(card.object_type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        $scope.checkMedsCardComplete(card);
        break;
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
        $scope.checkMeasCardComplete(card);
        break;
      default:
        break;
    }
  }

  $scope.checkMedsCardComplete = function(card) {
    if (card.completed_at != null || card.archived_at != null) return;
    var date_key = card.shown_at.substring(0,10);
    var schedule = $scope.findMedicationScheduleForCard(card)
    if (schedule == null) return;

    var medications = schedule.medications;
    var now    = (new Date()).toISOString();

    var medStatus = $scope.getMedsStatusArrays(schedule, medications, date_key);
    var takeMeds = medStatus.unfinished;
    var skippedMeds = medStatus.skipped;
    var completedMeds = medStatus.done;

    if (takeMeds.length == 0) {
      Card.complete(card);
    }
  }

  $scope.checkMeasCardComplete = function(card) {
    if (card.completed_at != null || card.archived_at != null) return;
    var date_key = card.shown_at.substring(0,10);
    var schedule = $scope.findMeasurementScheduleForCard(card)
    if (schedule == null) return;

    var measurements = schedule.measurements;
    var now    = (new Date()).toISOString();
    var measStatus = $scope.getMeasStatusArrays(schedule, measurements, date_key);
    var incompleteMeas = measStatus.incomplete;

    //console.log(incompleteMeas.length)
    if (incompleteMeas.length == 0) {
      Card.complete(card);
    }
  }

  $scope.statusClass = function(card) {
    this.checkCardComplete(card);
    // Return cardClass: urgent/active/completed
    if (card.completed_at == null) {
      if (card.type == CARD.TYPE.URGENT) {
        return "badge-assertive";
      } else {
        return "badge-energized";
      }
    } else {
      return "badge-balanced";
    }
  }

  $scope.iconClass = function(card) {
    if (card.object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE)
      return "ion-ios-medkit-outline";
    if (card.object_type == CARD.CATEGORY.APPOINTMENTS_SCHEDULE)
      return "ion-ios-calendar-outline";
    if (card.object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE)
      return "ion-arrow-graph-up-right";
  }

  $scope.statusText = function(card) {
    this.checkCardComplete(card);
    // Return cardClass: urgent/active/completed
    if (card.completed_at == null) {
      if (card.type == CARD.TYPE.URGENT) {
        return "Needs attention";
      } else {
        return "In progress";
      }
    } else {
      return "Completed";
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
   $scope.description = function(card) {
     type = card.object_type
     switch(type) {
       case CARD.CATEGORY.MEDICATIONS_SCHEDULE:
         return $scope.getMedicationsDescription(card);
       case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
         return $scope.getMeasurementsDescription(card);
       case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
         return ["Appointment Information"];
       case CARD.CATEGORY.GOALS :
         return ["View Goals"];
       //case CARD.CATEGORY.SYMPTOMS :
       default:
         return [""];
     } // end switch
   }

   $scope.constructMedItemString = function(itemsArray) {
     var str = "";
     for (var i = 0; i < itemsArray.length; i++) {
       if (i != 0) str += ", ";
       if (i != 0 && i == itemsArray.length - 1) str += " and ";
       str += itemsArray[i].trade_name;
     }
     return str;
   }

  // Get description for Medication Cards
  $scope.getMedicationsDescription = function(card) {
     var schedule = $scope.findMedicationScheduleForCard(card);
     if (schedule == null) return;
     var date_key = card.shown_at.substring(0,10);

     var medications = schedule.medications;
     var medStatus = $scope.getMedsStatusArrays(schedule, medications, date_key);
     var takeMeds = medStatus.unfinished;
     var skippedMeds = medStatus.skipped;
     var completedMeds = medStatus.done;

     // Create a string for each line for Take/Skipped/Completed meds
     // TODO -- is there a clean way to do this in the UI to filter?
     //         possible to have different UI templates depending on card category?
     string = "";
     if (takeMeds.length > 0) {
      string += "You need to take ";
      string += $scope.constructMedItemString(takeMeds);
      string += ". ";
    }

    if (completedMeds.length > 0) {
     string += "So far, you've taken "
     string += $scope.constructMedItemString(completedMeds);
     if (skippedMeds.length == 0) string += ".";
    }

     if (skippedMeds.length > 0) {
       if (completedMeds.length > 0)
        string += " and you've skipped "
       else
        string += " You've skipped "
        string += $scope.constructMedItemString(skippedMeds);
        string += ".";
     }
     return string;
  }

  $scope.constructItemString = function(itemsArray) {
    var str = "";
    for (var i = 0; i < itemsArray.length; i++) {
      if (i != 0) str += ", ";
      if (i != 0 && i == itemsArray.length - 1) str += " and ";
      str += itemsArray[i];
    }
    return str;
  }

  // Get description for Measurements Cards
  $scope.getMeasurementsDescription = function(card) {
    var schedule;
    schedule = $scope.findMeasurementScheduleForCard(card)
    if (schedule == null) return;

    var measurements  = schedule.measurements;
    var date_key = card.shown_at.substring(0,10);
    var measStatus = $scope.getMeasStatusArrays(schedule, measurements, date_key);
    var incompleteMeas = measStatus.incomplete;
    var completedMeas = measStatus.complete;

    // Create a string for each line for Completed/Incomplete Measurements
    // TODO -- is there a clean way to do this in the UI to filter?
    //         possible to have different UI templates depending on card category?
    string = "";
    if (incompleteMeas.length > 0) {
      string += "You need to complete ";
      string += $scope.constructItemString(incompleteMeas);
      string += ". ";
    }

    if (completedMeas.length > 0) {
      string += "So far, you've completed ";
      string += $scope.constructItemString(completedMeas);
      string += ".";
    }
    return string;
  }

  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   * TODO: fix other categories
   */
  $scope.openPage = function(card, type){
    switch(type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        var schedule = $scope.findMedicationScheduleForCard(card);
        action = {tab: 'tabsController.medicationCardAction', params: {schedule_id: schedule.$id}};
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE:
        var schedule = $scope.findMeasurementScheduleForCard(card);
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


  $scope.archive = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }

})
