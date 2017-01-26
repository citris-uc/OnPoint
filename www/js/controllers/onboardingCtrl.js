angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient, $ionicSlideBoxDelegate) {
  $scope.logout = function() {
    Patient.logout()
  }

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
    var onboardingRef = Patient.ref().child('onboarding');
    onboardingRef.set({'intro':true}).then(function(response) {
      Patient.setAttribute("onboarding", {"intro": true})
      $state.go("medication_identification.start")
    })
  }
})
