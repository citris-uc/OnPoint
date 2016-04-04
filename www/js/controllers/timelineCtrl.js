angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, MedicationSchedule, MeasurementSchedule) {
  $scope.cards = Card.get(); // assume this returns cards for today only (function call filters by day)
  $scope.CARD = CARD;
  $scope.unarchivedCards = $scope.cards.filter(function (c) {return c.archived_at == null;});
                            //.sort(function(a, b) {return Date.parse(a.updated_at) < Date.parse(b.updated_at)});
  $scope.cardBody = new Array($scope.unarchivedCards.length);


  $scope.getTime = function(timestamp) {
    console.log("get time");
    return new Date(timestamp);
  }

  $scope.getBody = function() {
    for (var i = 0; i < $scope.unarchivedCards.length; i++ ) {
      c = $scope.unarchivedCards[i];
      //console.log("unarchived card: " + c.id + " i " + i + " c.object_type " + c.object_type + " c.object_id " + c.object_id);
      //console.log("meds schedule: " + MedicationSchedule.findByID(c.object_id).medications);
      promise = Card.getBody(i, c.id);
      promise.then(function(val) {
        //console.log("promise return val: " + val);
        //console.log("promise returned cindex: " + val[0] +  " c.id: " + val[1] + " value: " + val[2]);
        $scope.cardBody[val[0]] = val[2];
        //console.log("CARDBODY: "+ $scope.cardBody);
      })
      //cardBody.push(Card.getBody(c.id));
    }
  }

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
    $scope.cardBody = new Array($scope.unarchivedCards.length);
    $scope.getBody();

  }

})
