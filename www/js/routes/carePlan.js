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

  .state('carePlan.measurement-add', {
    url: '/measurement_schedule/new',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/new_measurement_schedule.html',
        controller: 'measurementScheduleCtrl'
      }
    }
  })

  .state('carePlan.measurementSchedules', {
    url: '/measurement_schedules',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/measurement_schedules.html',
        controller: 'measurementScheduleCtrl'
      }
    }
  })
  // .state('carePlan.newMedication', {  // TODO: REMOVE
  //   url: '/medications/new',
  //   views: {
  //     'care-plan': {
  //       templateUrl: 'templates/carePlan/new_medication.html',
  //       controller: 'medInputCtrl'
  //     }
  //   }
  // })

  .state('carePlan.viewMeasurementSchedule', {
    url: '/measurementSchedule/:measurement_schedule_id',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/view_measurement_schedule.html',
        controller: 'measurementViewCtrl'
      }
    }
  })

  .state('carePlan.generatedMedSchedule', {
    url: '/medication_schedules/generated',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/generated_medication_schedule.html',
        controller: 'medicationsSettingCtrl'
      }
    }
  })

  .state('carePlan.newSlot', {
    url: '/medication_schedules/new_slot',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/new_time_slot.html',
        controller: 'medicationsSettingCtrl'
      }
    }
  })

  .state('carePlan.fillMain', {
    url: '/fill_main',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/fill_main.html',
        controller: 'medFillMainCtrl'
      }
    }
  })

  .state('carePlan.fillChoice', {
    url: '/fill_choice',
    views: {
      'care-plan': {
        templateUrl: 'templates/carePlan/fill_choice.html',
        controller: 'medFillMainCtrl'
      }
    }
  })
});
