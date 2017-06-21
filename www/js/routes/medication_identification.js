angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('medication_identification', {
    url: '/medication_identification',
    templateUrl: 'templates/onboarding/menu.html',
    controller: "onboardingCtrl",
    abstract: true
  })
  .state('medication_identification.welcome', {
    url: '/welcome',
    views: {
      'onboarding': {
        templateUrl: 'templates/medication_identification/welcome.html',
      }
    }
  })
  .state('medication_identification.start', {
    url: '/start',
    views: {
      'onboarding': {
        templateUrl: 'templates/medication_identification/start.html',
        controller: 'medicationsListCtrl'
      }
    }
  })
  .state('medication_identification.match', {
    url: '/match/:rxcui?:ocr&:search',
    views: {
      'onboarding': {
        templateUrl: 'templates/medication_identification/match.html',
        controller: 'medicationMatchCtrl'
      }
    }
  })
  .state('medication_identification.search', {
    url: '/search',
    views: {
      'onboarding': {
        templateUrl: 'templates/medication_identification/search.html',
        controller: 'medicationSearchCtrl'
      }
    }
  })
  .state('medication_identification.medication', {
    url: '/:id',
    views: {
      'onboarding': {
        templateUrl: 'templates/medication_identification/show.html',
        controller: 'medicationViewCtrl'
      }
    }
  })
});
