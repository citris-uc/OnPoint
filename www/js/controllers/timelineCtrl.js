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

    var today = (new Date()).toISOString().substring(0,10);
    Card.generateCardsFor(today);

    var tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate()+1);
    var tomorrow = tomorrowDate.toISOString().substring(0,10);
    Card.generateCardsFor(tomorrow);


    // var tomorrowsCardReq = Card.ref().child(tomorrow).once("value", function (snap) { //only do this once per day
    //   if (!snap.exists()) {
    //     MedicationSchedule.createTomorrowsCards();
    //     MeasurementSchedule.createTomorrowsCards();
    //     //TODO: need to do apointments  and goals?
    //   } else {
    //     // Check to make sure each has been generated
    //     var measExists = false;
    //     var medsExists = false;
    //     snap.forEach(function(childSnap) {
    //       if (childSnap.val().object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) measExists = true;
    //       if (childSnap.val().object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) medsExists = true;
    //     });
    //     if (!measExists) MeasurementSchedule.createTomorrowsCards();
    //     if (!medsExists) MedicationSchedule.createTomorrowsCards();
    //   }
    // }) //end todaysCard Req
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


  $scope.checkCardComplete = function(card) {
    switch(card.object_type) {
      case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
        if (card.completed_at != null || card.archived_at != null) return;

        var schedule = $scope.findMedicationScheduleForCard(card)
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

        var schedule = $scope.findMeasurementScheduleForCard(card)

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
              if(typeof(hist.measurements[meas.name]) != 'undefined') {
                exists= true;
                completedMeas.push(meas.name);
              }
            }
          }  //end historys
          if (!exists) {
            incompleteMeas.push(meas.name);
          }
        })
        //console.log(incompleteMeas.length)
        if (incompleteMeas.length == 0) {
          console.log("all measurements completed")
          Card.complete(card);
        }
        break;
      default:
        break;
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
         var schedule = $scope.findMedicationScheduleForCard(card)
         if (schedule == null) return;

         var medications   = schedule.medications;
         var takeMeds      = [];
         var skippedMeds   = [];
         var completedMeds = [];

         // Check history for each medication in the specified schedule.
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
         })

         // Create a string for each line for Take/Skipped/Completed meds
         // TODO -- is there a clean way to do this in the UI to filter?
         //         possible to have different UI templates depending on card category?
         string = ""
         if (takeMeds.length > 0) {
          string += "You need to take "
          takeMeds.forEach( function(med) {
            string += med.trade_name + ", "
          })

          string += ". "

        }

        if (completedMeds.length > 0) {
         string += "So far, you've taken "
         completedMeds.forEach( function(med) {
           string += med.trade_name + ", "
         })
       }

       if (skippedMeds.length > 0) {
         if (completedMeds.length > 0)
          string += " and you've skipped "
         else
          string += " You've skipped "

          skippedMeds.forEach( function(med) {
            string += " " + med.trade_name;
          })
       }

         return string;
       case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
         var schedule;
         schedule = $scope.findMeasurementScheduleForCard(card)
         if (schedule == null) return;

         var incompleteMeas = [];
         var completedMeas = [];

         var measurements  = schedule.measurements;
         measurements.forEach( function(meas) {
           var exists = false;
           for(var i = 0; i < $scope.measHistory.length; i++) {
             var hist = $scope.measHistory[i];
             if (hist.measurement_schedule_id==schedule.$id) {
               if(typeof(hist.measurements[meas.name]) != 'undefined') {
                 exists= true;
                 completedMeas.push(meas.name);
               }
             }
           }  //end historys
           if (!exists) {
             incompleteMeas.push(meas.name);
           }
         });
         // Create a string for each line for Completed/Incomplete Measurements
         // TODO -- is there a clean way to do this in the UI to filter?
         //         possible to have different UI templates depending on card category?
         string = ""
         if (incompleteMeas.length > 0) {
          string += "You need to complete "
          incompleteMeas.forEach( function(meas) {
            string += meas + ", "
          })
          string += ". "
        }


          if (completedMeas.length > 0) {
           string += "So far, you've completed "
           completedMeas.forEach( function(meas) {
             string += meas + ", "
           })
         }


         return string;
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
    if (index == 1) return;
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
        // action = {tab: 'tabsController.medicationsSchedule', params: {schedule_id: schedule.$id}};
         action = {tab: 'tabsController.medicationCardAction', params: {schedule_id: schedule.$id}};
        return $state.go(action.tab, action.params);
      case CARD.CATEGORY.MEASUREMENTS_SCHEDULE:
        var schedule = $scope.findMeasurementScheduleForCard(card)
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
