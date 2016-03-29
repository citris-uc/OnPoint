angular.module('app.controllers')

.controller('loginCtrl', function($scope, $state, Auth, Patient, $stateParams, $ionicPopup) {
  $scope.user  = {email: 'ucb.onpoint@gmail.com', password: 'onpoint'};
  $scope.state = {loading: false}

  $scope.login = function(){
    $scope.state.loading = true;

    Auth.$authWithPassword($scope.user).then(function(authData) {
      $scope.state.loading = false;
      Patient.setToken(authData.token)
      $state.go("tabsController.timeline");
    }).catch(function(error) {
      handleError(error)
    })

  }

  $scope.register = function()   {
    $scope.state.loading = true;

    Auth.$createUser($scope.user).then(function(authData) {
      $scope.state.loading = false;
      Patient.create($scope.user.email, authData)
      $state.go("tabsController.timeline");
    }).catch(function(error) {
      handleError(error)
    })
  }

  var handleError = function(error) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error
    });
    $scope.state.loading = false;
  }

})
