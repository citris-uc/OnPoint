angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/session/login.html',
    controller: 'loginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/session/register.html',
    controller: 'registrationCtrl'
  })

  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.timeline', {
    url: '/timeline',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/timeline.html',
        controller: 'timelineCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('tabsController.medications', {
    url: '/medications',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications.html',
        controller: 'medicationsCtrl'
      }
    }
  })

  .state('tabsController.medicationsSchedule', {
    url: '/medications/:schedule_id',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/schedule.html',
        controller: 'medicationScheduleCtrl'
      }
    }
  })

  .state('tabsController.medication', {
    url: '/medications/:schedule_id/:medicationName',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/show.html',
        controller: 'medicationCtrl'
      }
    }
  })

  .state('tabsController.measurements', {
    url: '/measurements',
    views: {
      'measurements-tab': {
        templateUrl: 'templates/measurements/measurements.html',
        controller: 'measurementsCtrl'
      }
    }
  })

  .state('tabsController.measurementAdd', {
    url: '/measurement-add',
    views: {
      'measurements-tab': {
        templateUrl: 'templates/measurements/measurements-add.html',
        controller: 'addMeasurementsCtrl'
      }
    }
  })

  .state('tabsController.measurementTips', {
    url: '/measurement-tips',
    views: {
      'measurements-tab': {
        templateUrl: 'templates/measurements/measurementTips.html',
        controller: 'measurementTipsCtrl'
      }
    }
  })

  .state('tabsController.appointments', {
    url: '/appointments',
    views: {
      'appointments-tab': {
        templateUrl: 'templates/appointments/appointments.html',
        controller: 'appointmentsCtrl'
      }
    }
  })

  .state('tabsController.appointment', {
    url: '/appointment/:appointmentId',
    views: {
      'appointments-tab': {
        templateUrl: 'templates/appointments/appointment.html',
        controller: 'appointmentCtrl'
      }
    }
  })

  .state('tabsController.addAppointment', {
    url: '/add-appointment',
    views: {
      'appointments-tab': {
        templateUrl: 'templates/appointments/addAppointment.html',
        controller: 'addAppointmentCtrl'
      }
    }
  })

  .state('tabsController.comments', {
    url: '/cards/:id/comments',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/comments.html',
        controller: 'commentsCtrl'
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

  .state('tabsController.addGoal', {
    url: '/add-goal',
    views: {
      'goals-tab': {
        templateUrl: 'templates/addGoal.html',
        controller: 'goalsCtrl'
      }
    }
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
});
