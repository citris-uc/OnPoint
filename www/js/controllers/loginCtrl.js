
angular.module('app.controllers')
.controller('loginCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
  $scope.state = {loading: false, error: null}
  $scope.user  = {email: 'ucb.onpoint@gmail.com', password: 'onpoint'};
  $scope.view  = "login"

  $scope.toggleTo = function(name) {
    $scope.state.error = null
    $scope.view        = name
  }
  //
  // $scope.login = function(){
  //   $scope.state = {loading: true, error: null}
  //   Patient.session($scope.user.email, $scope.user.password).then(function(response) {
  //     $scope.$emit(denguechat.env.auth.success, {token: response.data.token})
  //   }, function(error) {
  //     $scope.state.error = error.data.message
  //   }).finally(function() {
  //     $scope.state.loading = false;
  //   })
  // }

  var handleTransition = function() {
    $scope.state.loading = false;
  }

  // var handleError = function(error) {
  //   var alertPopup = $ionicPopup.alert({
  //     title: 'Error',
  //     template: error
  //   });
  //   $scope.state.loading = false;
  // }
  var handleError = function(error,user) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error,
      buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Register</b>',
        type: 'button-positive',
        onTap: function(e) {
          $state.go('register',{email: user.email});
        }
      }
    ]
    });
    $scope.state.loading = false;
  }


  $scope.login = function(){
    $scope.state.loading = true;

    Patient.auth().$authWithPassword($scope.user).then(function(authData) {
      // Patient.set(authData); //this will also set the Token
      $scope.$emit(onpoint.env.auth.success, {authData: authData})
      // req = Patient.ref().child('onboarding').once("value", function(snapshot) {
      //   var onboarding = snapshot.val();
      //   var nexState;
      //   if(!onboarding.completed) {
      //     if(onboarding.state == 'carePlan.setup' ||
      //           onboarding.state == 'carePlan.medicationSchedules' ||
      //           onboarding.state == 'carePlan.generatedMedSchedule') { // avoiding race conditions
      //       nextState = onboarding.state
      //     }
      //   }
      //   else {
      //     nextState = "tabsController.timeline"
      //   }
      //   handleTransition()
      //   $state.go(nextState);
      // }); //donr request for onboarding status

    }).catch(function(error) {
      handleError(error, $scope.user)
    })
  }


  $scope.signup = function(){
    if ($scope.user.password != $scope.user.password_confirmation) {
      $scope.state.error = "Passwords do not match"
      return
    }

    $scope.state.loading = true
    $scope.state.error   = true

    Patient.create($scope.user.email, $scope.user.password).then(function(response) {
      $scope.login()
    }, function(error) {
      if (error.data.errors.email)
        $scope.state.error = "Username " + error.data.errors.email[0]
      else if (error.data.errors.password)
          $scope.state.error = "Password " + error.data.errors.password[0]
    }).finally(function() {
      $scope.state.loading = false;
    })
  }
})


// angular.module('app.controllers')
//
// .controller('loginCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
//   $scope.user  = {email: 'ucb.onpoint@gmail.com', password: 'onpoint'};
//   $scope.state = {loading: false}
//

//
//
//   // Redirect to Timeline view if the user is already authenticated.
//   var authData = Patient.auth().$getAuth();
//   if (authData) {
//     handleTransition()
//     Patient.set(authData); //this will also set the Token
//     $state.go("tabsController.timeline");
//   }
//
//
//
// })
