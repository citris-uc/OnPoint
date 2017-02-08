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

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

  $scope.completeOnboarding = function() {
    Onboarding.ref().update({'intro':true}).then(function(response) {
      $state.go("medication_identification.start", {}, {reload: true})
    })
  }

  $scope.logout = function() {
    Patient.destoy().then(function(doc) {
      $ionicHistory.clearCache().then(function(response) {
        $scope.$emit(onpoint.env.auth.failure, {})
      })
    })
  }

})
