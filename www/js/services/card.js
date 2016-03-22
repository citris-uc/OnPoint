angular.module('app.services')

.factory("Card", ["CARD", function(CARD) {
  var cards = [{
    id: 0,
    created_at: "2016-03-15T10:00:00",
    updated_at: "2016-03-15T10:00:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.ACTION,
    object_type: CARD.CATEGORY.MEDICATIONS,
    object_id: 1
  }, {
    id: 1,
    created_at: "2016-03-15T11:00:00",
    updated_at: "2016-03-15T11:00:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.URGENT,
    object_type: CARD.CATEGORY.MEASUREMENTS,
    object_id: 1
  }, {
    id: 2,
    created_at: "2016-03-15T11:30:00",
    updated_at: "2016-03-15T11:30:00", //should arrange timeline by this timestamp
    completed_at: null,
    archived_at: null,
    type: CARD.TYPE.REMINDER,
    object_type: CARD.CATEGORY.APPOINTMENTS,
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
      var card = {
        id: cards.length + 1,
        created_at: now,
        updated_at: now,
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
    }
  };
}])
