angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('carePlan', {
    url: '/careplan',
    templateUrl: 'templates/carePlan.html',
    abstract: true
  })


  .state('carePlan.setup', {
    url: '/setup',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/setup.html',
        controller: 'carePlanCtrl'
      }
    }
  })
});
