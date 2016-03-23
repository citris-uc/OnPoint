angular.module('app.controllers')

.controller('timelineCtrl', function($scope, Card, CARD) {
  $scope.cards = Card.get();
  $scope.CARD = CARD;

  $scope.getTime = function(timestamp) {
    return new Date(timestamp);
  }

})
