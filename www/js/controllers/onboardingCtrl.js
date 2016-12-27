angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient) {
  console.log("hi")

  $scope.completeOnboarding = function() {
    var onboardingRef = Patient.ref().child('onboarding');
    onboardingRef.set({'completed':true}).then(function(response) {
      $state.go("medication_identification.welcome")
    })
  }
})
