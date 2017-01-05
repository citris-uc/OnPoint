angular.module('app.controllers')

.controller('timelineCtrl', function($scope, $state, Card, CARD, Comment, Medication, MedicationSchedule, Measurement, MeasurementSchedule, MedicationHistory, Appointment, Notes, $ionicSlideBoxDelegate, Patient) {
  $scope.timeline = {pageIndex: 1}
  $scope.today   = {timestamp: "", cards: []}
  $scope.history = {timestamp: "", cards: []}
  $scope.tomorrow = {timestamp: "", cards: []}

  $scope.changeTimeline = function(pageIndex) {
    $scope.timeline.pageIndex = pageIndex;
  }

  $scope.transitionToPageIndex = function(pageIndex) {
    $ionicSlideBoxDelegate.slide(pageIndex);
    // $ionicSlideBoxDelegate.update()
  }

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function() {
    if ($scope.timeline.pageIndex === 1) {
      Card.today().then(function(response) {
        $scope.today.cards = response.data.cards;
      }, function(response) {
        $scope.$emit(onpoint.env.error, {error: response})
      })

    } else if ($scope.timeline.pageIndex == 0) {
      Card.past().then(function(response) {
        $scope.history.cards = response.data.cards
      }, function(response) {
        $scope.$emit(onpoint.env.error, {error: response})
      })


    } else if ($scope.timeline.pageIndex == 2) {

      Card.tomorrow().then(function(response) {
        $scope.tomorrow.cards = response.data.cards;
      }, function(response) {
        $scope.$emit(onpoint.env.error, {error: response})
      })
    }
    $scope.$broadcast('scroll.refreshComplete');
  }

  $scope.archive = function(card) {
    if (card.completed_at != null) {
      Card.archive(card);
    }
  }

  // See http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event.
  // Essentially, we avoid stale data.
  $scope.$on('$ionicView.loaded', function(){
    $scope.loadCards();
  });
})
