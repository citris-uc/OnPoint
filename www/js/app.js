
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

angular.module('app', ['ionic', 'firebase', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.constants', 'dndLists', 'angularMoment', "underscore", "ngCordova", "ionicResearchKit"])

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

.filter('formatTime', function ($filter, moment) {
  return function (time) {
    date = moment(time, "HH:mm").format("hh:mm A")
    return $filter('date')(date, '');
  }
})

.filter('formatDateWithWeekday', function ($filter, moment) {
  return function (time) {
    date = moment(time, "YYYY-MM-DD").format("dddd, MMMM DD, YYYY")
    return $filter('date')(date, '');
  }
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


.run(function($ionicPlatform, $rootScope, Patient, $state, $ionicHistory, $ionicModal, Onboarding, $ionicSideMenuDelegate, $cordovaInAppBrowser) {
  // Patient.getFromFirebase().then(function(patient) {
  //   $rootScope.patient = patient
  //   console.log(patient)
  // })


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


  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
    console.log("State change sucesss.")
    Patient.getFromFirebase().then(function(p) {
      console.log("Returning from Firebase: " + JSON.stringify(p))

      if (!p || !p.uid) {
        $rootScope.$emit(onpoint.env.auth.failure, {})
      } else {
        $rootScope.patient = p
      }
      return p
    }).then(function(p) {

      if (toState.name.indexOf("profile") == -1 && toState.name.indexOf("onboarding") == -1 && toState.name.indexOf("medication_identification") == -1 && toState.name.indexOf("medication_scheduling") == -1) {
        if (!p.onboarding || !p.onboarding.intro ||!p.onboarding.medication_identification || !p.onboarding.medication_scheduling)
          $state.go("onboarding.welcome", {})
      }
    }).catch(function(res) {
      $rootScope.$emit(onpoint.error, res)
    })
  });

  //----------------------------------------------------------------------------\

  $rootScope.state = {loading: false}

  //----------------------------------------------------------------------------\

  loadLoginModal = function() {
    // Create the login modal that we will use later
    if (!$rootScope.modal) {
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
  }

  $rootScope.logout = function() {
    Patient.logout().then(function() {
      $ionicHistory.clearCache().then(function(response) {
        $rootScope.$emit(onpoint.env.auth.failure, {})
      })
    })
  };

  $rootScope.$on(onpoint.error, function(event, response) {
    // PouchDB errors.
    // console.log(JSON.stringify(response))
    // navigator.notification.alert(JSON.stringify(response), null)
    // return

    if (response.status == 404 && response.reason == "deleted") {
      $rootScope.$emit(onpoint.env.auth.failure, response)
      return
    }

    if (response.status == 404 && response.reason == "missing") {
      $rootScope.$emit(onpoint.env.auth.failure, response)
      return
    }


    if (response.name == "Error") {
      navigator.notification.alert(response.message, null, "Login failed", "OK")
      return
    }

    if (response.status == 403 && response.data) {
      navigator.notification.alert(response.data.error, null)
      return
    }

    if (response.error && (response.error.status == 401 || response.error.status == 403) ) {
      if ( !$rootScope.modal || ($rootScope.modal && !$rootScope.modal.isShown()) ) {
        loadLoginModal().then(function() {
          $rootScope.state.error = "Your session has expired"
          $rootScope.modal.show();
        })
      }
    } else {

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
        navigator.notification.alert("Something went wrong: " + JSON.stringify(response), null, "Contact dmitriskj@gmail.com", "OK")
      }
    }
  })


  $rootScope.$on(onpoint.env.auth.success, function(event, response) {
    $ionicHistory.clearCache().then(function() {
      if ($rootScope.modal)
        $rootScope.modal.remove().then(function() {
          $rootScope.$broadcast(onpoint.env.data.refresh);
        })
    })
  })

  $rootScope.$on(onpoint.env.auth.failure, function(event, data) {
    Patient.logout().catch(console.log.bind(console)).finally(function() {
      if ( !$rootScope.modal || ($rootScope.modal && !$rootScope.modal.isShown()) ) {
        loadLoginModal().then(function() {
          $rootScope.state.error = data.message
          $rootScope.modal.show();
        })
      }
    })
  })

  // Avoid keeping the sidemenu stale.
  $rootScope.$watch(function () {
    return $ionicSideMenuDelegate.isOpen(true);
  }, function(isOpen) {
    if (isOpen == true) {
      Patient.getFromFirebase().then(function(doc) {
        $rootScope.patient = doc;
      })
    }
  })



  $rootScope.openLink = function(url) {
    var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes',
      hardwareback: "yes",
      toolbarposition: "top"
    };

    $cordovaInAppBrowser.open(url, '_system', options)
  }

})
