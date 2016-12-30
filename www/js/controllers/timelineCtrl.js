angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, Measurement, MeasurementSchedule, MedicationHistory, Appointment, Notes, $ionicSlideBoxDelegate, Patient) {
  $scope.timeline = {pageIndex: 1}
  $scope.today   = {timestamp: "", cards: []}
  // $scope.history = {timestamp: "", cards: []}
  $scope.tomorrow = {timestamp: "", cards: []}
  $scope.history  = {cards: []}

  $scope.changeTimeline = function(pageIndex) {
    $scope.timeline.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $ionicSlideBoxDelegate.slide(pageIndex);
    // $ionicSlideBoxDelegate.update()
  }

  /*
   * This method checks a card's shown_at date with the 'date' param passed in locale time convention
   * @param date: a javascript date object
   */
  // $scope.checkCardDate = function(card, date) {
  //   var localeDate = date.toLocaleDateString();
  //   var cardLocaleDate = (new Date(card.shown_at)).toLocaleDateString();
  //   var blargh = new Date();
  //   //conole.log(test + ' ' + test.toISOString() + ' ' new Date(test))
  //   //console.log(typeof($scope.cards[0]));
  //   //console.log(cardLocaleDate+' '+localeDate)
  //   if(localeDate==cardLocaleDate) {
  //     //console.log(card.$id)
  //     return true;
  //   }
  //   return false;
  // }

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    // $scope.test = Card.getRangeByDate(new Date());
    // $scope.test.$loaded().then(function() {
    //   for (var i = 0; i < $scope.test.length; i++) {
    //     var date = $scope.test[i];
    //     for(key in date) {
    //       console.log(key + " " + date[key].shown_at);
    //     }
    //   }
    // })

    if ($scope.timeline.pageIndex === 1) {
      $scope.today.cards = Card.getRangeByDate(new Date());
    } else if ($scope.timeline.pageIndex == 0) {
      $scope.history.cards = Card.getHistory();
    } else if ($scope.timeline.pageIndex == 2) {
      $scope.tomorrow.cards = Card.getRangeByDate($scope.tomorrow.timestamp);
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

  $scope.findMedicationScheduleForCard = function(card) {
    var schedule = null;

    for (var i = 0; i < $scope.medSchedule.length; i++) {
      if ($scope.medSchedule[i].$id == card.object_id) {
        schedule = $scope.medSchedule[i];
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

  $scope.checkCardComplete = function(card, date_key) {
    $scope.completeFinishedMedications(card, date_key);
  }

  $scope.completeFinishedMedications = function(card, date_key) {
    if (card.completed_at != null || card.archived_at != null) return;

    var schedule = $scope.findMedicationScheduleForCard(card)
    if (schedule == null) return;

    var medications = schedule.medications;
    if (medications == null) return;

    var now = (new Date()).toISOString();
    var medStatus     = $scope.getMedsStatusArrays(schedule, medications, date_key);
    var takeMeds      = medStatus.unfinished;
    var skippedMeds   = medStatus.skipped;
    var completedMeds = medStatus.done;

    if (takeMeds.length == 0 && skippedMeds.length==0) {
      Card.complete(card);
    }
  }

  $scope.statusClass = function(card, date_key) {
    $scope.checkCardComplete(card, date_key);
    // Return cardClass: urgent/active/completed
    if(card.type == CARD.TYPE.REMINDER)
      return "badge-royal";
    if (card.completed_at == null) {
      if (card.type == CARD.TYPE.URGENT) {
        return "badge-assertive";
      } else {
        var timeCutoff = new Date();
        timeCutoff.setHours(timeCutoff.getHours()+3);
        var cardTime = new Date(card.shown_at);
        // If shown_at time is within 3 hours of now, mark card as "In Progress"
        if (cardTime < timeCutoff) {
          return "badge-energized";
        } else {
          return "badge-calm";
        }

      }
    } else {
      return "badge-balanced";
    }
  }


  $scope.statusText = function(card, date_key) {
    $scope.checkCardComplete(card, date_key);
    // Return cardClass: urgent/active/completed
    if (card.type==CARD.TYPE.REMINDER) {
      return 'Reminder';
    }
    if (card.completed_at == null) {
      if (card.type == CARD.TYPE.URGENT) {
        return "Needs attention";
      } else {
        var timeCutoff = new Date();
        timeCutoff.setHours(timeCutoff.getHours()+3);
        var cardTime = new Date(card.shown_at);

        // If shown_at time is within 3 hours of now, mark card as "In Progress"
        if (cardTime < timeCutoff) {
          return "In progress";
        } else {
          return "Upcoming";
        }
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

  // $scope.formatTitle = function(str) {
  //   if (str == CARD.CATEGORY.MEDICATIONS_CABINET || str == CARD.CATEGORY.MEDICATIONS_SCHEDULE_CHANGE)
  //     return 'Medications';
  //   var fstr = str.replace("_schedule","");
  //   fstr = fstr.charAt(0).toUpperCase() + fstr.slice(1);
  //   return fstr;
  // }

  /*
   * gets the body for each cardClass
   * @param index: this is the medication_schedule ID essentailly
   * TODO: fix medication_schedule ID to be actually ID in firebase, probbaly need to to do when we push med SCheudle to firebase during onboarding
   * TODO: fix other categories
   */
  //  NOTE: Needed to open the page...
  $scope.openPage = function(card, type){
    if (type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
      var schedule = $scope.findMedicationScheduleForCard(card);
      return $state.go('tabsController.medicationCardAction', {schedule_id: schedule.$id});
    }
  }

  $scope.archive = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }



  // See
  // http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event. Essentially,
  // we avoid stale data.
  $scope.$on('$ionicView.loaded', function(){
    $scope.medications = Medication.get();
    $scope.medSchedule = MedicationSchedule.get()

    // Calculate today's cards
    today_timestamp        = new Date()
    $scope.today.timestamp = today_timestamp
    $scope.today.cards     = Card.getRangeByDate(today_timestamp);

    // Calculate tomorrow timestamps.
    tomorrow_timestamp = new Date();
    tomorrow_timestamp.setDate(today_timestamp.getDate() + 1);
    $scope.tomorrow.timestamp = tomorrow_timestamp
    $scope.tomorrow.cards     = Card.getRangeByDate(tomorrow_timestamp);

    // Fetch medication history
    yesterday_timestamp = new Date();
    yesterday_timestamp.setDate(today_timestamp.getDate() - 1);
    $scope.medHistory =  MedicationHistory.getHistoryRange(yesterday_timestamp, tomorrow_timestamp);


    // We load cards and history in one cycle. Any changes will be reflected
    // thanks to Firebase's 3-way data binding.
    $scope.loadCards();
    $scope.history.cards = Card.getHistory();
    $scope.CARD = CARD;

    // NOTE: We run this just to have some cards generated.
    Card.generateCardsFor(today_timestamp.toISOString());
    Card.generateCardsFor(tomorrow_timestamp.toISOString());
  });


})
