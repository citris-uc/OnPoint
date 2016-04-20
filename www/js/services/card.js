angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationHistory", "$firebaseArray", "$firebaseObject", function(CARD, Patient, MedicationHistory, $firebaseArray, $firebaseObject) {
  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getByDay: function(date) {
      var dateISO = date.toISOString().substring(0,10)
      var ref = this.ref().child(dateISO);
      return $firebaseArray(ref);
    },
    getById: function(id) {
      var ref = this.todaysRef().child(id)
      return $firebaseObject(ref)
    },
    getHistory: function() {
      yesterday = new Date;
      yesterday.setDate( (new Date()).getDate() - 1 );
      var dateISO = yesterday.toISOString().substring(0,10)
      var ref = this.ref().orderByKey().endAt(dateISO).limitToLast(7);
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("cards");
    },
    todaysRef: function() {
      // TODO: No better way to get only the date from a Date object?
      var dateISO = (new Date()).toISOString().substring(0,10)  //Only get the date: YYYY-MM-DD
      return this.ref().child(dateISO);
    },

    create: function(date, card) {
      // DEPRECIATED: do NOT want to set the id of each card to be the object_id, want a unique_id and have child object_id!
      // var ref = this.ref().child(date).child(object.type).child(object.id);
      // ref.set(card);

      var ref = this.ref().child(date);
      ref.push(card); //use push to generate a UNIQUE card ID for each firebase card.
    },
    // DEPRECIATED
    // find_or_create_by_object(object, cardObject) {
    //   console.log(object)
    //   var ref = this.todaysRef().child(object.type).child(object.id)
    //   return ref.transaction(function(current) {
    //     if (!current)
    //       current = {}
    //
    //     var now    = (new Date()).toISOString();
    //     current.created_at   = now;
    //     current.updated_at   = now;
    //     current.shown_at     = cardObject.shown_at || (new Date()).toISOString();
    //     current.completed_at = cardObject.completed_at || null;
    //     current.archived_at  = null;
    //     current.type         = cardObject.type
    //     return current
    //   })
    // },
    complete: function(card) {
      // var card;
      // for(var i = 0; i < cards.length; i++) {
      //   if (cards[i].id === cardID)
      //     card = cards[i]
      // }
      //
      // if (card) {
      //   now = (new Date()).toISOString();
      //   card.updated_at   = now;
      //   card.completed_at = now;
      // }
      // return card;
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      updateObject = {updated_at: now,
                      completed_at: now};

      //Add to or update firebase
      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) { //this date child exists
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },


    archive: function(card) {
      // var card;
      // for(var i = 0; i < cards.length; i++) {
      //   if (cards[i].id === cardID)
      //     card = cards[i]
      // }
      //
      // if (card) {
      //   now = (new Date()).toISOString();
      //   card.updated_at  = now;
      //   card.archived_at = now;
      // }
      // return card;
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      updateObject = {updated_at: now,
                      archived_at: now};

      //Add to or update firebase
      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) { //this date child exists
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },
    checkCardUpdate: function(card){
      // Check the latest timestamp for the card
      switch(card.object_type) {
        case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
          // // Get schedule associated with card
          // var schedule = MedicationSchedule.findByID(card.object_id);
          // var medications = schedule.medications;
          //
          // // Check history for each medication in the specified schedule
          // // Save timestamp of latest for the updated_at
          // var latestChange = card.updated_at;
          // medications.forEach( function(med) {
          //   var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
          //   if (history != null) {
          //     if (history.taken_at != null) {
          //       if (Date.parse(history.taken_at) > Date.parse(latestChange)) {
          //         latestChange = history.taken_at;
          //       }
          //     }
          //     if (history.skipped_at != null) {
          //       if (Date.parse(history.skipped_at) > latestChange) {
          //         latestChange = history.skipped_at;
          //       }
          //     }
          //   }
          // })
          //
          // card.updated_at = latestChange != null ? latestChange : null;

          return;
        case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
          return;
        case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
          return;
        case CARD.CATEGORY.GOALS :
          return;
        //case CARD.CATEGORY.SYMPTOMS :
        default:
          return;
      } // end switch

    },
    checkCardComplete: function(card) {
      // Check if this card is completed and update completed_at
      if (card.completed_at != null) return;

      switch(card.object_type) {
        case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
          // Get schedule associated with card
          // var schedule = MedicationSchedule.findByID(card.object_id);
          // var medications = schedule.medications;
          // var takeMeds = [];
          // var skippedMeds = [];
          // var completedMeds = [];
          //
          // // Check history for each medication in the specified schedule
          // medications.forEach( function(med) {
          //   var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
          //   if (history == null)
          //     takeMeds.push(med);
          //   else if (history.taken_at != null) {
          //     completedMeds.push(med);
          //   } else if (history.skipped_at != null) {
          //     skippedMeds.push(med);
          //   }
          // })
          // All meds are complete;
          // TODO --> meds that can't be skipped should be forked off into separate card
          // if (takeMeds.length == 0) {
          //   this.complete(card.id);
          // }
          return;
        case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
          return;
        case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
          return;
        case CARD.CATEGORY.GOALS :
          return;
        //case CARD.CATEGORY.SYMPTOMS :
        default:
          return;
      } // end switch
    }

  };


}])
