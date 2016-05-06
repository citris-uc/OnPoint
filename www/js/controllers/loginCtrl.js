angular.module('app.controllers')

.controller('loginCtrl', function($scope, $state, $ionicHistory, Patient, $ionicPopup) {
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
  var authData = Patient.auth().$getAuth();
  if (authData) {
    handleTransition()
    Patient.set(authData); //this will also set the Token
    $state.go("tabsController.timeline");
  }

  $scope.login = function(){
    $scope.state.loading = true;

    Patient.auth().$authWithPassword($scope.user).then(function(authData) {
      Patient.set(authData); //this will also set the Token
      req = Patient.ref().child('onboarding').once("value", function(snapshot) {
        var onboarding = snapshot.val();
        var nexState;
        if(!onboarding.completed) {
          if(onboarding.state == 'carePlan.setup' ||
                onboarding.state == 'carePlan.medicationSchedules' ||
                onboarding.state == 'carePlan.generatedMedSchedule') { // avoiding race conditions
            nextState = onboarding.state
          }
        }
        else {
          nextState = "tabsController.timeline"
        }
        handleTransition()
        $state.go(nextState);
      }); //donr request for onboarding status

    }).catch(function(error) {
      handleError(error, $scope.user)
    })
  }

  var handleError = function(error,user) {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: error,
      buttons: [
      { text: 'Cancle' },
      {
        text: '<b>Register</b>',
        type: 'button-positive',
        onTap: function(e) {
          $state.go('register',{email: user.email, password: user.password});
        }
      }
    ]
    });
    $scope.state.loading = false;
  }

})
