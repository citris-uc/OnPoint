angular.module('app.services')

.factory("Card", ["CARD", "MedicationSchedule", "MedicationHistory", function(CARD, MedicationSchedule, MedicationHistory) {
  var cards = [{
    id: 0,
    created_at: "2016-03-15T10:00:00",
    updated_at: "2016-03-15T10:00:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.ACTION,
    object_type: CARD.CATEGORY.MEDICATIONS_SCHEDULE,
    object_id: 1
  }, {
    id: 1,
    created_at: "2016-03-15T11:00:00",
    updated_at: "2016-03-15T11:00:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.URGENT,
    object_type: CARD.CATEGORY.MEASUREMENTS_SCHEDULE,
    object_id: 1
  }, {
    id: 2,
    created_at: "2016-03-15T11:30:00",
    updated_at: "2016-03-15T11:30:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.REMINDER,
    object_type: CARD.CATEGORY.APPOINTMENTS_SCHEDULE,
    object_id: 1
  }, {
    id: 3,
    created_at: "2016-03-15T12:00:00",
    updated_at: "2016-03-15T12:30:00", //should arrange timeline by this timestamp
    completed_at: "2016-03-15T12:30:00",
    archived_at: null,
    type: CARD.TYPE.REMINDER,
    object_type: CARD.CATEGORY.GOALS,
    object_id: 1
  }, {
    id: 4,
    created_at: "2016-03-15T12:00:00",
    updated_at: "2016-03-15T12:30:00", //should arrange timeline by this timestamp
    completed_at: "2016-03-15T12:30:00",
    archived_at: "2016-03-15T12:30:00",
    type: CARD.TYPE.URGENT,
    object_type: CARD.CATEGORY.SYMPTOMS_SCHEDULE,
    object_id: 1
  }];

  return {
    get: function() {
      return cards;
    },
    find_by_object: function(object_id, object_type) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].object_id === object_id && cards[i].object_type === object_type)
          card = cards[i];
      }
      return card;
    },
    create_from_object: function(object, object_type, card_type) {
      var now = (new Date()).toISOString();
      var showAt = new Date();

      if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
        time = object.time.split(":");
        showAt.setHours(time[0],time[1]);
        showAt = showAt.toISOString();
      } else {
        showAt = (new Date()).toISOString();
      }
      var card = {
        id: cards.length + 1,
        created_at: now,
        updated_at: now,
        shown_at: showAt,
        completed_at: null,
        archived_at: null,
        type: card_type,
        object_id: object.id,
        object_type: object_type
      }
      cards.push(card)
      return card;
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
    getAction: function(cardID) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardID)
          card = cards[i]
      }

      switch(card.object_type) {
        case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
          // Take Medications --> Show Schedule
          var schedule = MedicationSchedule.findByID(card.object_id);
          return {tab: 'tabsController.medicationsSchedule', params: {schedule_id: schedule.id}};
        case CARD.CATEGORY.MEASUREMENTS_SCHEDULE :
          return {tab: 'tabsController.measurementAdd', params: {}}
        case CARD.CATEGORY.APPOINTMENTS_SCHEDULE :
          return {tab: 'tabsController.appointments', params: {}}
        case CARD.CATEGORY.GOALS :
          return {tab: 'tabsController.goals', params: {}}
        //case CARD.CATEGORY.SYMPTOMS :
        default:
          return {tab: 'tabsController', params: {}}
      }
    },
    getBody: function(cardID) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardID)
          card = cards[i]
      }

      switch(card.object_type) {
        case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
          // Get schedule associated with card
          var schedule = MedicationSchedule.findByID(card.object_id);
          var medications = schedule.medications;
          var takeMeds = [];
          var skippedMeds = [];
          var completedMeds = [];

          // Check history for each medication in the specified schedule
          // TODO: Refactor this to query against a MedicationHistory array.
          medications.forEach( function(med) {
            var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
            if (history == null)
              takeMeds.push(med);
            else if (history.taken_at != null) {
              completedMeds.push(med);
            } else if (history.skipped_at != null) {
              skippedMeds.push(med);
            }
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
    },
    getCardStatus: function(cardID) {
      var card;
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].id === cardID)
          card = cards[i]
      }
      //this.checkCardUpdate(card);
      //this.checkCardComplete(card);
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
    },
    checkCardUpdate: function(card){
      // Check the latest timestamp for the card
      switch(card.object_type) {
        case CARD.CATEGORY.MEDICATIONS_SCHEDULE :
          // Get schedule associated with card
          var schedule = MedicationSchedule.findByID(card.object_id);
          var medications = schedule.medications;

          // Check history for each medication in the specified schedule
          // Save timestamp of latest for the updated_at
          var latestChange = card.updated_at;
          medications.forEach( function(med) {
            var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
            if (history != null) {
              if (history.taken_at != null) {
                if (Date.parse(history.taken_at) > Date.parse(latestChange)) {
                  latestChange = history.taken_at;
                }
              }
              if (history.skipped_at != null) {
                if (Date.parse(history.skipped_at) > latestChange) {
                  latestChange = history.skipped_at;
                }
              }
            }
          })

          card.updated_at = latestChange != null ? latestChange : null;

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
          var schedule = MedicationSchedule.findByID(card.object_id);
          var medications = schedule.medications;
          var takeMeds = [];
          var skippedMeds = [];
          var completedMeds = [];

          // Check history for each medication in the specified schedule
          medications.forEach( function(med) {
            var history = MedicationHistory.findByMedicationIdAndScheduleId(med.id, schedule.id);
            if (history == null)
              takeMeds.push(med);
            else if (history.taken_at != null) {
              completedMeds.push(med);
            } else if (history.skipped_at != null) {
              skippedMeds.push(med);
            }
          })

          // All meds are complete;
          // TODO --> meds that can't be skipped should be forked off into separate card
          if (takeMeds.length == 0) {
            this.complete(card.id);
          }
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
