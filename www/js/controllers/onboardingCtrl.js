angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient, $ionicSlideBoxDelegate, Onboarding, $ionicHistory) {
  Onboarding.getFromCloud().then(function(doc) {
    $scope.onboarding = doc
  })

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  $scope.transitionToPageIndex = function(pageIndex) {
    $scope.slideIndex = pageIndex;
    $ionicSlideBoxDelegate.slide(pageIndex);
  }

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.completeOnboarding = function() {
    Onboarding.update({'intro':true}).then(function(response) {
      $state.go("medication_identification.start", {}, {reload: true})
    })
  }
})
