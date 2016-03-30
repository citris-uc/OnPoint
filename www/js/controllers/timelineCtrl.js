angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, MedicationSchedule, MeasurementSchedule) {
  $scope.cards = Card.get();
  $scope.CARD = CARD;

  $scope.getTime = function(timestamp) {
    return new Date(timestamp);
  }

  $scope.getBody = function(card) {
   return Card.getBody(card.id);
  }

  $scope.openPage = function(card){
    action = Card.getAction(card.id);
    $state.go(action.tab, action.params);
  }

  $scope.shouldDisplayCard = function(timestamp) {
    var cardDate = $scope.getTime(timestamp);
    var now = new Date();
    if (cardDate.toDateString() == now.toDateString() && cardDate.toTimeString()  < now.toTimeString())
      return true;
    return false;
  }
  $scope.generateCardsForToday = function() {
    var medSchedule = MedicationSchedule.get();
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
  }

  $scope.swipeCard = function(card) {
    if (card.completed_at != null) {
      Card.archive(card.id);
    }
  }

})
