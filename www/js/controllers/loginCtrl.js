angular.module('app.controllers')

.controller('loginCtrl', function($scope, $state, $stateParams, $ionicPopup) {
  $scope.user  = {email: 'ucb.onpoint@gmail.com', password: 'onpoint'};
  $scope.state = {loading: false}

  $scope.logIn = function(){
    $scope.state.loading = true;

    var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
    firebaseRef.authWithPassword($scope.user, function(error, authData) {
      if (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: error
        });
      } else {
        window.localStorage.setItem("authData", JSON.stringify(authData));
        $state.go("tabsController.timeline");
      }

      $scope.state.loading = false;
    });
  }

  $scope.createAccount = function()   {
    $scope.state.loading = true;

    var firebaseRef = new Firebase("https://vivid-inferno-5187.firebaseio.com/");
    firebaseRef.createUser($scope.user, function(error, authData) {
      if (error) {
        var alertPopup = $ionicPopup.alert({
          title: 'Error creating user',
          template: error
        });
      } else {
        window.localStorage.setItem("authData", JSON.stringify(authData));
        $state.go("tabsController.timeline");
      }

      $scope.state.loading = false;
    });
  }

})
