angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient, $ionicSlideBoxDelegate, Onboarding) {
  $scope.logout = function() {
    Patient.logout()
  }

  Onboarding.getFromCloud().then(function(doc) {
    $scope.onboarding = doc.val()
  })

  $scope.next = function() {
     $ionicSlideBoxDelegate.next();
   };
   $scope.previous = function() {
     $ionicSlideBoxDelegate.previous();
   };

   // Called each time the slide changes
   $scope.slideChanged = function(index) {
     $scope.slideIndex = index;
   };

  $scope.completeOnboarding = function() {
    Onboarding.ref().update({'intro':true}).then(function(response) {
      $state.go("medication_identification.start", {}, {reload: true})
    })
  }
})
