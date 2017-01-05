angular.module('app.routes')

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('onboarding', {
    url: '/onboarding',
    templateUrl: 'templates/onboarding/menu.html',
    controller: "onboardingCtrl",
    abstract: true
  })
  .state('onboarding.welcome', {
    url: '/welcome',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/welcome.html',
        controller: "onboardingCtrl"
      }
    }
  })
  .state('onboarding.identify_meds', {
    url: '/identify_meds',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/identify_meds.html',
      }
    }
  })
  .state('onboarding.schedule_meds', {
    url: '/schedule_meds',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/schedule_meds.html',
      }
    }
  })
  .state('onboarding.timeline', {
    url: '/timeline',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/timeline.html',
        controller: "onboardingCtrl"
      }
    }
  })
  .state('onboarding.ready_to_start', {
    url: '/finish',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/ready_to_start.html',
        controller: "onboardingCtrl"
      }
    }
  })
  .state('onboarding.complete', {
    url: '/complete',
    views: {
      'onboarding': {
        templateUrl: 'templates/onboarding/complete.html',
        controller: "onboardingCtrl"
      }
    }
  })
});
