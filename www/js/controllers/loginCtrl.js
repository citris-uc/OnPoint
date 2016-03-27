angular.module('app.controllers')

.controller('loginCtrl', function($scope, $state, $stateParams,$ionicPopup) {
  $scope.user ={email: 'ucb.onpoint@gmail.com', password: 'onpoint'};

  $scope.logIn = function(){
    var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
    firebaseRef.authWithPassword({
      email : $scope.user.email,
      password: $scope.user.password
    }, function(error, authData) {
      if (error) {
      console.log($scope.user.email);
      console.log($scope.user.password);
      console.log("Login Failed!", error)

    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error
    });

    } else {
      console.log("Authenticated successfully with payload:", authData);
      window.localStorage["authData"] = JSON.stringify(authData);
      console.log(JSON.parse(window.localStorage["authData"])); 
      //$localstorage.setObject("authData", authData);
      $state.go("tabsController.timeline");
    }
  });
  }

  $scope.createAccount = function()   {
    var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
    firebaseRef.createUser({
      email : $scope.user.email,
      password: $scope.user.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    });
  }

})
