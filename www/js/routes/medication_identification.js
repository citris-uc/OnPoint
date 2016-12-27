angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/medication_identification/welcome')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('medication_identification', {
    url: '/medication_identification',
    templateUrl: 'templates/medication_identification/menu.html',
    abstract: true
  })
  .state('medication_identification.welcome', {
    url: '/welcome',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/welcome.html',
      }
    }
  })
  .state('medication_identification.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/start.html',
        controller: 'medListCtrl'
      }
    }
  })
  .state('medication_identification.new', {
    url: '/new',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/new.html',
        controller: 'newMedicationCtrl'
      }
    }
  })
  .state('medication_identification.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/search.html',
        controller: 'medicationSearchCtrl'
      }
    }
  })
  .state('medication_identification.edit', {
    url: '/:id/edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/edit.html',
      }
    }
  })
  .state('medication_identification.medication', {
    url: '/:id',
    views: {
      'menuContent': {
        templateUrl: 'templates/medication_identification/show.html',
        controller: 'medicationCtrl'
      }
    }
  })
});
