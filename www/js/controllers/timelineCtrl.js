angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, $ionicLoading, Patient) {
  $scope.today    = {timestamp: "", cards: []}
  $scope.firstLoad = true

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading cards...", hideOnStateChange: true});

    Card.today().then(function(response) {
      console.log(response)
      $scope.today.cards = response.data.cards;
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    }).finally(function(response) {
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    })
  }

  $scope.archive = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }

  $scope.openPage = function(card, type){
    console.log(card)
    if (card.status == "past")
      navigator.notification.alert("This card has expired!",null)
    else
      return $state.go('tabsController.medication_schedule', {card_id: card.id, schedule_id: card.object_id});
  }

  // See http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event.
  // Essentially, we avoid stale data.
  // $scope.$on('$ionicView.loaded', function(){
  //   $scope.loadCards();
  // });

  $scope.$on('$ionicView.afterEnter', function(){
    if ($scope.today.cards.length == 0)
      $scope.loadCards();
  });
})
