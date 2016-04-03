angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, MedicationSchedule, MeasurementSchedule) {
  $scope.cards = Card.get(); // assume this returns cards for today only (function call filters by day)
  $scope.CARD = CARD;
  $scope.unarchivedCards = $scope.cards.filter(function (c) {return c.archived_at == null;});
                            //.sort(function(a, b) {return Date.parse(a.updated_at) < Date.parse(b.updated_at)});

  $scope.getTime = function(timestamp) {
    console.log("get time");
    return new Date(timestamp);
  }

  $scope.getBody = function() {
    var cardBody = [];
    for (var i = 0; i < $scope.cards.length; i++ ) {
      c = $scope.cards[i];
      console.log("all card:" + c.id + "archived_at: " + c.archived_at);
    }

    for (var i = 0; i < $scope.unarchivedCards.length; i++ ) {
      c = $scope.unarchivedCards[i];
      console.log("unarchived card:" + c.id);
      promise = Card.getBody(c.id);
      promise.then(function(val) {
        console.log("promise returned cindex: " + cardBody.length  + " value; " + val);
        cardBody[val[0]] = val;
      })
      console.log(promise)
      //cardBody.push(Card.getBody(c.id));
    }
    return cardBody;
  }
  $scope.cardBody = $scope.getBody();

  $scope.openPage = function(card){
    action = Card.getAction(card.id);
    $state.go(action.tab, action.params);
  }

  $scope.shouldDisplayCard = function(timestamp) {
    var cardDate = $scope.getTime(timestamp);
    var now = new Date();
    if (cardDate.toDateString() == now.toDateString() && cardDate.toTimeString()  <= now.toTimeString())
      return true;
    return false;
  }
  $scope.generateCardsForToday = function() {
    console.log("gen cards");
    var medSchedule = MedicationSchedule.get();
    /*medSchedule.then(function(val) {
      //console.log(val)
      var measurementSchedule = MeasurementSchedule.get();
      var today = new Date();
      var currentDay = today.getDay();

      //Create medications Cards for the day
      for (var i =0; i < val.length; i++) {

        slot = val[i];
        //console.log(slot.time);
        if (slot.days.includes(currentDay)) {
          Card.create_from_object(slot, CARD.CATEGORY.MEDICATIONS_SCHEDULE, CARD.TYPE.ACTION);
        }
      }

      for(var i = 0; i < measurementSchedule.length; i++) {
        slot = measurementSchedule[i];
        if (slot.days.includes(currentDay)) {
          Card.create_from_object(slot, CARD.CATEGORY.MEASUREMENTS_SCHEDULE, CARD.TYPE.ACTION);
        }
      }
      //console.log($scope.cards.length);
    })
    */

    var measurementSchedule = MeasurementSchedule.get();
    var today = new Date();
    var currentDay = today.getDay();

    //Create medications Cards for the day
    for (var i =0; i < medSchedule.length; i++) {

      slot = medSchedule[i];
      //console.log(slot.time);
      if (slot.days.includes(currentDay)) {
        Card.create_from_object(slot, CARD.CATEGORY.MEDICATIONS_SCHEDULE, CARD.TYPE.ACTION);
      }
    }

    for(var i = 0; i < measurementSchedule.length; i++) {
      slot = measurementSchedule[i];
      if (slot.days.includes(currentDay)) {
        Card.create_from_object(slot, CARD.CATEGORY.MEASUREMENTS_SCHEDULE, CARD.TYPE.ACTION);
      }
    }
    console.log($scope.cards.length);

    // TODO --> update these arrays in callback
    $scope.unarchivedCards = $scope.cards.filter(function (c) {return c.archived_at == null;});
    $scope.cardBody = $scope.getBody();

  }

})
