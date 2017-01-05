angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient) {
  $scope.patient = Patient.get()
  console.log($scope.patient)

  $scope.completeOnboarding = function() {
    var onboardingRef = Patient.ref().child('onboarding');
    onboardingRef.set({'intro':true}).then(function(response) {
      pat = Patient.get()
      pat.onboarding.intro = true
      Patient.set(pat)
      $state.go("medication_identification.welcome")
    })
  }
})
