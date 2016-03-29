angular.module('app.services')

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})
