
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'firebase', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.constants', 'dndLists'])

//src: https://github.com/fmquaglia/ngOrderObjectBy
.filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      if(item !=null) { //need this bc its a firebaseObject, going to have a lot of random metadata attached to the object
        filtered.push(item);
      }
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
    if(reverse) filtered.reverse();
    return filtered;
  };
})

/*
 * Use this filter to use orderBy on an object returned from FIREBASE
 * use this instead of orderObjectBy because we can keep the firebase object ID or KEY!
 */
.filter('toArray', function () {
    'use strict';
    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }
        var keys = Object.keys(obj);
        var arr = [];
        for(var i = 0; i < keys.length; i++) {
          if (typeof(obj[keys[i]])==='object' && obj[keys[i]] !=null) { //need this bc its a firebaseObject, going to have a lot of random metadata attached to the object
            arr.push(Object.defineProperty(obj[keys[i]], '$id', {__proto__: null, value: keys[i]}));
          }
        }
        return arr;
    }
})


.run(function($ionicPlatform, $rootScope, Patient, $state, $ionicHistory, $ionicModal) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Commented out due to https://github.com/driftyco/ionic-plugin-keyboard
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (!navigator.notification) {
      navigator.notification = window
    }

  });

  // The authentication hook that is triggered on every state transition.
  // We check if the user is logged-in, and if not, then we cancel the current
  // state transition and go to the login screen.
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    if (toState.name.indexOf("onboarding") == -1) {
      // Save the onboarding state locally.
      onboarding = Patient.get().onboarding
      if (onboarding == undefined || onboarding == null) {
        req = Patient.ref().child('onboarding').once("value", function(snapshot) {
          Patient.setAttribute("onboarding", snapshot.val() || "")
        });
      }

      onboarding = Patient.get().onboarding
      if (!onboarding || !onboarding.intro) {
        event.preventDefault()
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true,
          historyRoot: true
        })
        $state.go('onboarding.welcome');
      }
    }

  });

  Patient.auth().$onAuth(function(authData) {
    if (authData)
      Patient.setAttribute("uid", authData.uid)
    else
      $rootScope.$emit(onpoint.env.error, {error: {status: 401}})
  })


  //----------------------------------------------------------------------------\

  $rootScope.state = {loading: false}

  //----------------------------------------------------------------------------\

  loadLoginModal = function() {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $rootScope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $rootScope.modal = modal;
    });
  }

  $rootScope.$on(onpoint.env.error, function(event, response) {
    console.log("Received response...")
    if (response.error) {
      if (response.error.status == 401) {
        if ( !$rootScope.modal || ($rootScope.modal && !$rootScope.modal.isShown()) ) {
          loadLoginModal().then(function() {
            $rootScope.state.error = "Your session has expired"
            $rootScope.modal.show();
          })
        }
      } else if (response.error.message) {
        navigator.notification.alert(response.error.message, null, "Contact dmitriskj@gmail.com", "OK")
      } else if (response.error.status == 500) {
        navigator.notification.alert("Something went wrong on our end.", null, "Server not responding", "OK")
      } else if (response.error.status == 0) {
        navigator.notification.alert("We couldn't connect to the server. Are you connected to the internet?", null, "Server not responding", "OK")
      } else if (response.error.status === 422) {
        navigator.notification.alert(response.data.error, null, "Server not responding", "OK")
      } else if (response.error && response.error.status === -1) {
        navigator.notification.alert("We couldn't reach the server. Try again later.", null, "Server not responding", "OK")
      } else if (response.error.status !== -1) {
        navigator.notification.alert("Something went wrong on our end.", null, "Server not responding", "OK")
      }
    } else {
      navigator.notification.alert("Something went wrong", null, "Contact dmitriskj@gmail.com", "OK")
    }
  })

  $rootScope.$on(onpoint.env.auth.success, function(event, response) {
    Patient.setAttribute("token", response.token)
    Patient.setAttribute("uid", response.uid)

    if ($rootScope.modal)
      $rootScope.modal.remove().then(function() {
        $rootScope.$broadcast(onpoint.env.data.refresh);
      })
  })

  $rootScope.$on(onpoint.env.auth.failure, function(event, data) {
    // Patient.setToken(null);
    if ( !$rootScope.modal || ($rootScope.modal && !$rootScope.modal.isShown()) ) {
      loadLoginModal().then(function() {
        $rootScope.state.error = data.message
        $rootScope.modal.show();
      })
    }
  })



})
