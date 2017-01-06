angular.module('app.controllers')
.controller('onboardingCtrl', function($scope, $state, Patient) {
  $scope.patient = Patient.get()
  console.log($scope.patient)

  $scope.logout = function() {
    Patient.logout()
  }

  $scope.completeOnboarding = function() {
    var onboardingRef = Patient.ref().child('onboarding');
    onboardingRef.set({'intro':true}).then(function(response) {
      Patient.setAttribute("onboarding", {"intro": true})
      $state.go("medication_identification.welcome")
    })
  }
})
