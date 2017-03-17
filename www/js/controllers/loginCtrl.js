
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


.controller('loginCtrl', function($scope, $state, $ionicHistory, Patient, $ionicLoading) {
  $scope.state = {loading: false, error: null, view: "login"}
  $scope.user  = {};

  $scope.genders = [{value: "male", display: "Male"}, {value: "female", display: "Female"}]

  $scope.toggleTo = function(name) {
    $scope.state.error = null
    $scope.state.view  = name
  }

  $scope.login = function(){
    $ionicLoading.show({hideOnStateChange: true})

    Patient.login($scope.user).then(function(response) {
      $scope.$emit(onpoint.env.auth.success, response)
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.signup = function()   {
    $ionicLoading.show({hideOnStateChange: true})

    Patient.create($scope.user).then(function(response) {
      $ionicHistory.clearCache().then(function() {
        $state.go("onboarding.welcome", {}, {reload: true})
        $scope.login()
      })
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
