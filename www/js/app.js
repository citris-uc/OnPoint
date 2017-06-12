
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

.filter('formatDaySchedule', function ($filter) {
  return function (days) {
    day_abbreviations = ["M", "Tue", "W", "Thu", "F", "Sat", "Sun"]
    new_days = _.map(days, function(day, index) {
      if (day)
        return day_abbreviations[index]
      else
        return ""
    })

    new_days = _.compact(new_days)

    return $filter('date')(new_days.join(","), '');
  }
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
  // We need this since $rootScope.modal is async.f
  $rootScope.isLoginModalActive = false;

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
    $rootScope.isLoginModalActive = true

    if (!$rootScope.modal || !$rootScope.modal.isShown()) {
      return $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $rootScope,
        animation: 'slide-in-up',
        focusFirstInput: true,
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $rootScope.modal = modal;
        return $rootScope.modal.show();
      });
    }
  }

  $rootScope.logout = function() {
    $rootScope.$emit(onpoint.env.auth.failure, {})
  };

  $rootScope.$on(onpoint.error, function(event, response) {
    // navigator.notification.alert("RECEIVED ERROR IN onpoint.error", null, "Login failed", "OK")
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

    if (response.status == 500) {
      navigator.notification.alert("Something went wrong on our end. Please try again or restart the app.", null, "Server encountered an error (500)", "OK")
      return
    }

    if (response.error && (response.error.status == 401 || response.error.status == 403) ) {
      $rootScope.$emit(onpoint.env.auth.failure, response)
      return
    } else {
      console.log(response)

      if (response.error) {
        if (response.error.message) {
          navigator.notification.alert(response.error.message, null, "Contact dmitriskj@gmail.com", "OK")
        } else if (response.error.status == 500) {
          navigator.notification.alert("Something went wrong on our end. Please try again or restart the app.", null, "Server encountered an error (500)", "OK")
        } else if (response.error.status == 0) {
          navigator.notification.alert("We couldn't communicate to the server because there doesn't seem to be an internet connection present. If this issue persists, contact dmitriskj@gmail.com and say the status code is 0.", null, "Something went wrong on our end (0)", "OK")
        } else if (response.error.status === 422) {
          navigator.notification.alert(response.data.error, null, "Server not responding", "OK")
        } else if (response.error.status !== -1) {
          navigator.notification.alert("Please restart the app. If the issue persist, contact dmitriskj@gmail.com", null, "Something went wrong on our end (-1)", "OK")
        }
      } else {
        navigator.notification.alert("Please restart the app. If the issue persist, contact dmitriskj@gmail.com", null, "Something went wrong on our end (status code not known)", "OK")
      }
    }
  })

  $rootScope.$on(onpoint.env.auth.success, function(event, response) {
    // $ionicHistory.clearCache().then(function() {
      if ($rootScope.modal)
        $rootScope.modal.hide().then(function() {
          $rootScope.isLoginModalActive = false;
          $state.go("tabsController.timeline", {}, {reload: true})
        })
    // })
  })

  $rootScope.$on(onpoint.env.auth.failure, function(event, data) {
    // navigator.notification.alert("RECEIVED onpoint.env.auth.failre ", null, "Login failed", "OK")
    Patient.logout().catch(console.log.bind(console)).finally(function() {
      if ( !$rootScope.modal || ($rootScope.modal && !$rootScope.modal.isShown()) ) {
        loadLoginModal().then(function() {
          $rootScope.state.error = data.message
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
