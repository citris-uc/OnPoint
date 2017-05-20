angular.module('app.controllers')

.controller('historyCtrl', function($scope, $state, $ionicLoading, Card) {
  $scope.dates = []
  $scope.end_date_string = moment().format("YYYY-MM-DD")
  console.log(moment().format("YYYY-MM-DD"))

  $scope.refresh = function() {
    $scope.end_date_string = moment().format("YYYY-MM-DD")
    $scope.loadCards($scope.end_date_string)
  }

  // This loads cards depending on the page we're currently on. For instance,
  // if we're on Today view, then we'll load cards for today/tomorrow. On the
  // History view, we'll load all cards.
  $scope.loadCards = function(end_date_string) {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading cards...", hideOnStateChange: true});

    Card.history(end_date_string).then(function(response) {
      for (var i=0;i < response.data.dates.length; i++) {
        $scope.dates.push(response.data.dates[i])
      }

      $scope.end_date_string = response.data.end_date_string
    }).catch(function(res) {
      $scope.$emit(onpoint.error, res)
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$applyAsync(function(){
        $scope.$broadcast('scroll.infiniteScrollComplete');
      })
      $ionicLoading.hide();
    })
  }

  // See http://www.gajotres.net/understanding-ionic-view-lifecycle/
  // to understand why we're doing everything in a beforeEnter event.
  // Essentially, we avoid stale data.
  $scope.$on('$ionicView.loaded', function(){
    $scope.loadCards($scope.end_date_string);
  });

  $scope.loadMore = function() {
    console.log("Loading more...")
    $scope.loadCards($scope.end_date_string);
  }
})
