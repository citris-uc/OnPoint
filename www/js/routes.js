angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.measurements', {
    url: '/measurements',
    views: {
      'measurements-tab': {
        templateUrl: 'templates/measurements.html',
        controller: 'measurementsCtrl'
      }
    }
  })

  .state('tabsController.measurementAdd', {
    url: '/measurement-add',
    views: {
      'measurements-tab': {
        templateUrl: 'templates/measurements-add.html',
        controller: 'addMeasurementsCtrl'
      }
    }
  })


  .state('tabsController.appointments', {
    url: '/appointments',
    views: {
      'appointments-tab': {
        templateUrl: 'templates/appointments.html',
        controller: 'appointmentsCtrl'
      }
    }
  })

  .state('tabsController.goals', {
    url: '/goals',
    views: {
      'goals-tab': {
        templateUrl: 'templates/goals.html',
        controller: 'goalsCtrl'
      }
    }
  })

  // .state('login', {
  //   url: '/page7',
  //   templateUrl: 'templates/login.html',
  //   controller: 'loginCtrl'
  // })


  .state('addGoal', {
    url: '/add-goal',
    templateUrl: 'templates/addGoal.html',
    controller: 'addGoalCtrl'
  })

  .state('appointment', {
    url: '/appointment',
    templateUrl: 'templates/appointment.html',
    controller: 'appointmentCtrl'
  })

  .state('symptomsSlider', {
    url: '/tabs4',
    templateUrl: 'templates/symptomsSlider.html',
    controller: 'symptomsSliderCtrl'
  })

  .state('symptomsList', {
    url: '/symptoms-list',
    templateUrl: 'templates/symptomsList.html',
    controller: 'symptomsListCtrl'
  })

  .state('symptomsListMultiple', {
    url: '/symptoms-list-multiple',
    templateUrl: 'templates/symptomsListMultiple.html',
    controller: 'symptomsListMultipleCtrl'
  })

  .state('measurementTips', {
    url: '/measurement-tips',
    templateUrl: 'templates/measurementTips.html',
    controller: 'measurementTipsCtrl'
  })

  $urlRouterProvider.otherwise('/tabs/measurements')
});
