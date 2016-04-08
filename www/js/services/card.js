angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationHistory", "$firebaseArray", "$firebaseObject", function(CARD, Patient, MedicationHistory, $firebaseArray, $firebaseObject) {
  // var cards = [{
  //   id: 0,
  //   created_at: "2016-03-15T10:00:00",
  //   updated_at: "2016-03-15T10:00:00", //should arrange timeline by this timestamp
  //   completed_at: null,
  //   archived_at: null,
  //   type: CARD.TYPE.ACTION,
  //   object_type: CARD.CATEGORY.MEDICATIONS_SCHEDULE,
  //   object_id: 1
  // }, {
  //   id: 1,
  //   created_at: "2016-03-15T11:00:00",
  //   updated_at: "2016-03-15T11:00:00", //should arrange timeline by this timestamp
  //   completed_at: null,
  //   archived_at: null,
  //   type: CARD.TYPE.URGENT,
  //   object_type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE,
  //   object_id: 1
  // }, {
  //   id: 2,
  //   created_at: "2016-03-15T11:30:00",
  //   updated_at: "2016-03-15T11:30:00", //should arrange timeline by this timestamp
  //   completed_at: null,
  //   archived_at: null,
  //   type: CARD.TYPE.REMINDER,
  //   object_type: CARD.CATEGORY.APPOINTMENTS_SCHEDULE,
  //   object_id: 1
  // }, {
  //   id: 3,
  //   created_at: "2016-03-15T12:00:00",
  //   updated_at: "2016-03-15T12:30:00", //should arrange timeline by this timestamp
  //   completed_at: "2016-03-15T12:30:00",
  //   archived_at: null,
  //   type: CARD.TYPE.REMINDER,
  //   object_type: CARD.CATEGORY.GOALS,
  //   object_id: 1
  // }, {
  //   id: 4,
  //   created_at: "2016-03-15T12:00:00",
  //   updated_at: "2016-03-15T12:30:00", //should arrange timeline by this timestamp
  //   completed_at: "2016-03-15T12:30:00",
  //   archived_at: "2016-03-15T12:30:00",
  //   type: CARD.TYPE.URGENT,
  //   object_type: CARD.CATEGORY.SYMPTOMS_SCHEDULE,
  //   object_id: 1
  // }];

  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getByDay: function(date) {
      var dateISO = date.toISOString().substring(0,10)  //Only get the date: YYYY-MM-DD
      var ref = this.ref().child(dateISO);
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("cards");
    },

    create: function(date, object, card) {
      var ref = this.ref().child(date).child(object.type).child(object.id);
      ref.set(card);
    },
    find_or_create_by_object(object, cardObject) {
      // console.log("Object is: ")
      // console.log(object)
      // console.log("cardObject is: ")
      // console.log(cardObject)

      var ref = this.ref().child(object.type).child(object.id)
      return ref.transaction(function(current) {
        if (!current)
          current = {}

        var now    = (new Date()).toISOString();
        current.created_at   = now;
        current.updated_at   = now;
        current.shown_at     = cardObject.shown_at || (new Date()).toISOString();
        current.completed_at = cardObject.completed_at || null;
        current.archived_at  = null;
        current.type         = cardObject.type
        return current
      })
    },
    complete: function(cardID) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardID)
          card = cards[i]
      }

      if (card) {
        now = (new Date()).toISOString();
        card.updated_at   = now;
        card.completed_at = now;
      }
      return card;
    },
    archive: function(cardID) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardID)
          card = cards[i]
      }

      if (card) {
        now = (new Date()).toISOString();
        card.updated_at  = now;
        card.archived_at = now;
      }
      return card;
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
          // // Get schedule associated with card
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
          //
          // // All meds are complete;
          // // TODO --> meds that can't be skipped should be forked off into separate card
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
