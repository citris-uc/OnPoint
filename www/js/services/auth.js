angular.module('app.services')

.factory("Auth", function($firebaseAuth) {
  var patientsRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/patients");
  return $firebaseAuth(patientsRef);
})
