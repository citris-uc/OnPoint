
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


.run(function($ionicPlatform, $rootScope, Patient, $state, $ionicHistory) {
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
  });

  // The authentication hook that is triggered on every state transition.
  // We check if the user is logged-in, and if not, then we cancel the current
  // state transition and go to the login screen.
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    var token = Patient.getToken();
    if (!token && toState.name !== "login" && toState.name !== "register") {
      //console.log(toState.name)
      event.preventDefault();
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      })
      $state.go("login");
    }
  });
})
