angular.module('app.controllers')

.controller('loginCtrl', function($scope, $state, $ionicHistory, Auth, Patient, $ionicPopup) {
  $scope.user  = {email: 'ucb.onpoint@gmail.com', password: 'onpoint'};
  $scope.state = {loading: false}

  var handleTransition = function() {
    $scope.state.loading = false;

    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true,
      historyRoot: true
    })
  }

  var handleError = function(error) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error
    });
    $scope.state.loading = false;
  }

  // Redirect to Timeline view if the user is already authenticated.
  var authData = Auth.$getAuth();
  if (authData) {
    handleTransition()
    Patient.setToken(authData.token);
    $state.go("tabsController.timeline");
  }

  $scope.login = function(){
    $scope.state.loading = true;

    Auth.$authWithPassword($scope.user).then(function(authData) {
      handleTransition()
      Patient.setToken(authData.token);
      $state.go("tabsController.timeline");
    }).catch(function(error) {
      handleError(error)
    })
  }

  $scope.register = function()   {
    $scope.state.loading = true;

    Auth.$createUser($scope.user).then(function(authData) {
      handleTransition()
      Patient.create($scope.user.email, authData)
      $state.go("tabsController.timeline");
    }).catch(function(error) {
      handleError(error)
    })
  }
})
