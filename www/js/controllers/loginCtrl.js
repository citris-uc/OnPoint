
angular.module('app.controllers')

.directive('groupedRadio', function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      model: '=ngModel',
      value: '=groupedRadio'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
      element.addClass('button');
      element.on('click', function(e) {
        scope.$apply(function() {
          ngModelCtrl.$setViewValue(scope.value);
        });
      });

      scope.$watch('model', function(newVal) {
        element.removeClass('button-positive');
        if (newVal === scope.value) {
          element.addClass('button-positive');
        }
      });
    }
  };
})


.controller('loginCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
  $scope.state = {loading: false, error: null, view: "login"}
  $scope.user  = {};

  $scope.toggleTo = function(name) {
    $scope.state.error = null
    $scope.state.view  = name
  }

  $scope.login = function(){
    $scope.state.loading = true;

    Patient.auth().$authWithPassword($scope.user).then(function(response) {
      $scope.$emit(onpoint.env.auth.success, response)
    }).catch(function(response) {
      $scope.state.loading = false;
      $scope.$emit(onpoint.env.error, {error: response})
    }).finally(function() {
      $scope.state.loading = false;
    })
  }

  $scope.signup = function()   {
    $scope.state.loading = true;

    Patient.auth().$createUser($scope.user).then(function(response) {
      Patient.setUID(response.uid)
      Patient.create($scope.user).then(function() {
        $scope.login()
      })
    }).catch(function(response) {
      $scope.$emit(onpoint.env.error, {status: 401, error: response})
    }).finally(function() {
      $scope.state.loading = false;
    })
  }
})
