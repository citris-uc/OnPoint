angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/page7',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.measurements', {
    url: '/page9',
    views: {
      'tab2': {
        templateUrl: 'templates/measurements.html',
        controller: 'measurementsCtrl'
      }
    }
  })

  .state('tabsController.appointments', {
    url: '/appointments',
    views: {
      'tab3': {
        templateUrl: 'templates/appointments.html',
        controller: 'appointmentsCtrl'
      }
    }
  })

  .state('tabsController.goals', {
    url: '/page12',
    views: {
      'tab8': {
        templateUrl: 'templates/goals.html',
        controller: 'goalsCtrl'
      }
    }
  })

  .state('addGoal', {
    url: '/page11',
    templateUrl: 'templates/addGoal.html',
    controller: 'addGoalCtrl'
  })

  .state('appointment', {
    url: '/appointment',
    templateUrl: 'templates/appointment.html',
    controller: 'appointmentCtrl'
  })

  .state('symptomsSlider', {
    url: '/page14',
    templateUrl: 'templates/symptomsSlider.html',
    controller: 'symptomsSliderCtrl'
  })

  .state('symptomsList', {
    url: '/page15',
    templateUrl: 'templates/symptomsList.html',
    controller: 'symptomsListCtrl'
  })

  .state('symptomsListMultiple', {
    url: '/page16',
    templateUrl: 'templates/symptomsListMultiple.html',
    controller: 'symptomsListMultipleCtrl'
  })

  .state('measurementTips', {
    url: '/page17',
    templateUrl: 'templates/measurementTips.html',
    controller: 'measurementTipsCtrl'
  })

$urlRouterProvider.otherwise('/page1/page9')

  

});