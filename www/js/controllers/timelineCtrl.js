angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, Measurement, MeasurementSchedule, MedicationHistory, Appointment, $ionicSlideBoxDelegate) {
  $scope.timeline = {pageIndex: 0}

  $scope.changeTimeline = function(pageIndex) {
    $scope.timeline.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $ionicSlideBoxDelegate.slide(pageIndex);
  }

  /*
   * This method checks a card's shown_at date with the 'date' param passed in locale time convention
   * @param date: a javascript date object
   */
  $scope.checkCardDate = function(card, date) {
    var localeDate = date.toLocaleDateString();
    var cardLocaleDate = (new Date(card.shown_at)).toLocaleDateString();
    var blargh = new Date();
    //conole.log(test + ' ' + test.toISOString() + ' ' new Date(test))
    //console.log(typeof($scope.cards[0]));
    //console.log(cardLocaleDate+' '+localeDate)
    if(localeDate==cardLocaleDate) {
      //console.log(card.$id)
      return true;
    }
    return false;
  }
  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    $scope.test = Card.getRangeByDate(new Date());
    // $scope.test.$loaded().then(function() {
    //   for (var i = 0; i < $scope.test.length; i++) {
    //     var date = $scope.test[i];
    //     for(key in date) {
    //       console.log(key + " " + date[key].shown_at);
    //     }
    //   }
    // })

    if ($scope.timeline.pageIndex === 0) {
      //$scope.cards = Card.getByDay(new Date());
      $scope.cards = Card.getRangeByDate(new Date());
      var manana = new Date();
      manana.setDate(manana.getDate() + 1);
      //$scope.tomorrowCards = Card.getByDay(manana);
      $scope.tomorrowCards = Card.getRangeByDate(manana);
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
    $scope.yesterday   = new Date();
    $scope.yesterday.setDate($scope.yesterday.getDate()-1);
    $scope.today       = new Date();
    $scope.tomorrow    = new Date();
    $scope.tomorrow.setDate($scope.tomorrow.getDate()+1);
    $scope.medSchedule = MedicationSchedule.get()
    // $scope.medHistory  = MedicationHistory.getTodaysHistory()
    $scope.medHistory =  MedicationHistory.getHistoryRange($scope.yesterday, $scope.tomorrow);
    $scope.medications = Medication.get();
    $scope.numComments = new Array($scope.cards.length)
    $scope.measurementSchedule = MeasurementSchedule.get();
    //$scope.measHistory = Measurement.getTodaysHistory(); // Measurement History
    $scope.measHistory = Measurement.getHistoryRange($scope.yesterday, $scope.tomorrow);
    var fromDate = new Date();
    var toDate = new Date();
    fromDate.setDate(fromDate.getDate()-CARD.TIMESPAN.DAYS_AFTER_APPT);
    toDate.setDate(toDate.getDate()+CARD.TIMESPAN.DAYS_BEFORE_APPT);
    $scope.appointments = Appointment.getAppointmentsFromTo(fromDate, toDate);
    Card.generateCardsFor($scope.today.toISOString());
    Card.generateCardsFor($scope.tomorrow.toISOString());
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
    if (medications != null) {
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
        //var history_date = $scope.medHistory.$ref().key();

        // If the history reference matches the passed in date then check validity
        //if (date_key == history_date)
        if ($scope.medHistory.hasOwnProperty(date_key)) {
          var medHistory = $scope.medHistory[date_key];
          // for(var i = 0; i < medHistory.length; i++)
          //   var hist = medHistory[i];
          for(hist_id in medHistory) {
            var hist = medHistory[hist_id];
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
    }
    return {unfinished: takeMeds, skipped: skippedMeds, done: completedMeds};
  }

  $scope.getMeasStatusArrays = function(schedule, measurements, date_key) {
    var incompleteMeas = [];
    var completedMeas = [];

    measurements.forEach( function(meas) {
      var exists = false;
      //var history_date = $scope.measHistory.$ref().key();

      // If the history reference matches the passed in date then check validity
      //if (date_key == history_date)
      // for(var i = 0; i < $scope.measHistory.length; i++)
      // var hist = $scope.measHistory[i];
      if($scope.measHistory.hasOwnProperty(date_key)) {
        var measHistory = $scope.measHistory[date_key]
        for(hist_id in measHistory) {
          var hist = measHistory[hist_id];
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

  $scope.checkCardComplete = function(card, date_key) {
    switch(card.object_type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        $scope.checkMedsCardComplete(card, date_key);
        break;
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
        $scope.checkMeasCardComplete(card, date_key);
        break;
      default:
        break;
    }
  }

  $scope.checkMedsCardComplete = function(card, date_key) {
    if (card.completed_at != null || card.archived_at != null) return;
    //var date_key = card.shown_at.substring(0,10);
    var schedule = $scope.findMedicationScheduleForCard(card)
    if (schedule == null) return;

    var medications = schedule.medications;

    if (medications == null) return;
    var now    = (new Date()).toISOString();

    var medStatus = $scope.getMedsStatusArrays(schedule, medications, date_key);
    var takeMeds = medStatus.unfinished;
    var skippedMeds = medStatus.skipped;
    var completedMeds = medStatus.done;

    if (takeMeds.length == 0 && skippedMeds.length==0) {
      Card.complete(card);
    }
  }

  $scope.checkMeasCardComplete = function(card, date_key) {
    if (card.completed_at != null || card.archived_at != null) return;
    //var date_key = card.shown_at.substring(0,10);
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

  $scope.statusClass = function(card, date_key) {
    this.checkCardComplete(card, date_key);
    // Return cardClass: urgent/active/completed
    if(card.type == CARD.TYPE.REMINDER)
      return "badge-balanced";
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
    if (card.object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE || card.object_type == CARD.CATEGORY.MEDICATIONS_CABINET || card.object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE)
      return "ion-ios-medkit-outline";
    if (card.object_type == CARD.CATEGORY.APPOINTMENTS)
      return "ion-ios-calendar-outline";
    if (card.object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE || card.object_type == CARD.CATEGORY.MEASUREMENT_LOGGED)
      return "ion-arrow-graph-up-right";
  }

  $scope.statusText = function(card, date_key) {
    this.checkCardComplete(card, date_key);
    // Return cardClass: urgent/active/completed
    if (card.type==CARD.TYPE.REMINDER) {
      return 'Reminder';
    }
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
    if (str == CARD.CATEGORY.MEDICATIONS_CABINET || str == CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE)
      return 'Medications';
    else if (str == CARD.CATEGORY.MEASUREMENT_LOGGED)
      return 'Measurements'
    else if (str == CARD.CATEGORY.APPOINTMENTS)
      return 'Appointment Reminder'
    var fstr = str.replace("_schedule","");
    fstr = fstr.charAt(0).toUpperCase() + fstr.slice(1);
    return fstr;
  }

  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   */
   $scope.description = function(card, date_key) {
     type = card.object_type
     switch(type) {
       case CARD.CATEGORY.MEDICATIONS_SCHEDULE:
         return $scope.getMedicationsDescription(card, date_key);
       case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
         return $scope.getMeasurementsDescription(card, date_key);
       case CARD.CATEGORY.APPOINTMENTS:
         return $scope.getAppointmentDescription(card);
       case CARD.CATEGORY.GOALS :
         return ["View Goals"];
       case CARD.CATEGORY.MEDICATIONS_CABINET :
         return $scope.getMedicationsCabinetDescription(card, date_key);
       case CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE:
        return 'Edited Medication Schedule';
       case CARD.CATEGORY.MEASUREMENT_LOGGED:
        return $scope.getMeasurementLoggedDescription(card, date_key);
       //case CARD.CATEGORY.SYMPTOMS :
       default:
         return [""];
     } // end switch
   }

   $scope.getAppointmentDescription = function(card) {
     for(var i = 0; i < $scope.appointments.length; i++) {
       var date = $scope.appointments[i];
       if(date.hasOwnProperty(card.object_id)) {
         var appt = date[card.object_id];
         var time = new Date(appt.time);
         return 'You have an appointment ' + appt.title + ' on ' + time.toDateString() + ' at ' + time.toLocaleTimeString();
       }
     }
    //console.log($scope.appointments);
    return 'sup';
   }
   $scope.getMeasurementLoggedDescription = function(card, date_key) {
     //var date_key = card.shown_at.substring(0,10);
    //  for(var i = 0; i < $scope.measHistory.length; i++) {
    //    var hist = $scope.measHistory[i];
    //console.log(date_key)
     if($scope.measHistory.hasOwnProperty(date_key)) {
       var measHistory = $scope.measHistory[date_key];
       for(hist_id in measHistory) {
         var hist = measHistory[hist_id];
         if(hist_id == card.object_id) {
           return 'You logged a new measurement: ' + hist.measurements['name'];
         }
       }
     }
   }
   $scope.getMedicationsCabinetDescription = function(card, date_key) {
     //var date_key = card.shown_at.substring(0,10);

    //  for(var i = 0; i < $scope.medHistory.length; i++)
    //    var hist = $scope.medHistory[i];

       if ($scope.medHistory.hasOwnProperty(date_key)) {
         var medHistory = $scope.medHistory[date_key];
         for(hist_id in medHistory) {
           var hist = medHistory[hist_id];
           if(hist_id == card.object_id) { //found proper history reference, construct stirng
             for(var j = 0; j < $scope.medications.length; j++) {
               var med = $scope.medications[j];
               if(med.$id==hist.medication_id) {
                 var reason = ""
                 if(hist.reason!=null) {
                   reason = " because " +  hist.reason
                 }
                 return "You took " + med.trade_name + reason;
               }
             }
           }
       }
     }
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
  $scope.getMedicationsDescription = function(card, date_key) {
     var schedule = $scope.findMedicationScheduleForCard(card);
     if (schedule == null) return;
     //var date_key = card.shown_at.substring(0,10);

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

     if (takeMeds.length == 0 && completedMeds.length == 0 && skippedMeds.length == 0) {
       string += "You have no medications scheduled for this time.";
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
  $scope.getMeasurementsDescription = function(card, date_key) {
    var schedule;
    schedule = $scope.findMeasurementScheduleForCard(card)
    if (schedule == null) return;

    var measurements  = schedule.measurements;
    //var date_key = card.shown_at.substring(0,10);
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
      case CARD.CATEGORY.APPOINTMENTS:
        for(var i = 0; i < $scope.appointments.length; i++) {
          var date = $scope.appointments[i];
          if(date.hasOwnProperty(card.object_id)) {
            var appt = date[card.object_id];
            var time = new Date(appt.time);
            action = {tab: 'tabsController.appointment', params: {date:date.$id, appointment_id:card.object_id}}
            return $state.go(action.tab, action.params);
          }
        }

      case CARD.CATEGORY.GOALS :
        action = {tab: 'tabsController.goals', params: {}}
        $state.go(action.tab, action.params);
      default:
        action = {tab: 'tabsController', params: {}}
        return $state.go(action.tab, action.params);
    }
  }

  $scope.archive = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }

})
