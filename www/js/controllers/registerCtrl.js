angular.module('app.controllers')

/*
Source: http://codepen.io/niyando/pen/GpEeQR
*/
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

.controller('registerStepOneCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
  $scope.user = {email: "", password: ""};
  $scope.state = {loading: false}

  $scope.register = function()   {
    $scope.state.loading = true;

    Patient.auth().$createUser($scope.user).then(function(authData) { //Create User
      //console.log(authData)
      Patient.auth().$authWithPassword($scope.user).then(function(authData) { //Then Log in
        //console.log(authData)
        $scope.state.loading = false;

        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true,
        })

        Patient.set(authData); //this will also set the Token
        Patient.ref().set({email: $scope.user.email})
        $state.go("register.stepTwo");
      }).catch(function(error) {
        handleError(error)
      })



    }).catch(function(error) {
      handleError(error)
    })
  }

  $scope.disableContinue = function() {
    if ($scope.user.email=="" || $scope.user.password =="")
      return true;
    else
      return false;
  }

  var handleError = function(error) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error
    });
    $scope.state.loading = false;
  }
})

.controller('registerStepTwoCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
  $scope.user = {};

  $scope.start = function() {
    var ref = Patient.ref();
    //Use UPDATE, to NOT OVERWRITE email address!
    $scope.user['onboarding'] = true
    $scope.user['onboarding_step'] = 'carePlan.setup'
    var req = ref.update($scope.user) //Setting Patient Information.
    req.then(function(ref) {

      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
      })

      //TODO: redirect to onboarding process
      $state.go("carePlan.setup");
    })
  }
  $scope.disableContinue = function() {
    if ($scope.user.first_name==null || $scope.user.last_name == null || $scope.user.age == null || $scope.user.gender == null)
      return true;
    else
      return false;
  }

})
