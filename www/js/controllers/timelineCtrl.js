angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, $ionicLoading, Patient) {
  $scope.dates    = []
  $scope.firstLoad = true

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading cards...", hideOnStateChange: true});

    Card.today().then(function(response) {
      $scope.dates = response.data.dates;
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

  $scope.isTomorrow = function(date) {
    console.log(moment(date).diff(moment(new Date())) > 0)
    return moment(date).diff(moment(new Date())) > 0
  }

  $scope.openPage = function(card, type, date){
    if (card.status == "past")
      navigator.notification.alert("This card has expired!",null)
    else
      return $state.go('tabsController.medication_schedule', {card_id: card.id, date: date, schedule_id: card.object_id});
  }

  $scope.$on('$ionicView.afterEnter', function(){
    if ($scope.dates.length == 0)
      $scope.loadCards();
  });

  $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
    if (fromState.name == toState.name)
      $scope.loadCards();
  });


})
