angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/tabs/timeline')

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('tabsController', {
    url: '/tabs',
    templateUrl: 'templates/app.html',
    controller: "appCtrl",
    abstract:true
  })
  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })
  .state('tabsController.history', {
    url: '/history',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/history.html',
        controller: 'historyCtrl'
      }
    }
  })
  .state('tabsController.measurements', {
    url: '/measurements',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/measurements/index.html',
        controller: 'measurementsCtrl'
      }
    }
  })
  .state('tabsController.measurement_reminders', {
    url: '/measurements/reminders',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/measurements/schedules.html',
        controller: 'measurementsSchedulerCtrl'
      }
    }
  })
  .state('tabsController.surveys', {
    url: '/surveys',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/surveys/index.html',
        controller: 'surveyCtrl'
      }
    }
  })
  .state('tabsController.resources', {
    url: '/resources',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/resources/index.html',
        controller: 'resourcesCtrl'
      }
    }
  })
  .state('tabsController.resource', {
    url: '/resources/:name?:path',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/resources/show.html',
        controller: 'resourceCtrl'
      }
    }
  })
  .state('tabsController.resource_download', {
    url: '/resources/download/:name?:path',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/resources/download.html',
        controller: 'resourceDownloadCtrl'
      }
    }
  })
  .state('tabsController.appointments', {
    url: '/appointments',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/appointments/index.html',
        controller: 'appointmentsCtrl'
      }
    }
  })
  .state('tabsController.appointments.show', {
    url: '/:id',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/appointments/show.html',
        controller: 'appointmentsCtrl'
      }
    }
  })
  .state('tabsController.appointments.new', {
    url: '/appointments/new',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/appointments/new.html',
        controller: 'appointmentsCtrl'
      }
    }
  })
  .state('tabsController.appointments.edit', {
    url: '/:id/edit',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/appointments/edit.html',
        controller: 'appointmentsCtrl'
      }
    }
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
  .state('tabsController.medication_reminder_history_card', {
    url: '/history/medication_schedule/:schedule_id?:card_id&:date',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/history/medication_reminder.html',
        controller: 'medicationScheduleCardCtrl'
      }
    }
  })
  .state('tabsController.medication_schedule', {
    url: '/timeline/medication_schedule/:schedule_id?:card_id&:date',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/timeline/medication_schedule.html',
        controller: 'medicationScheduleCardCtrl'
      }
    }
  })
  .state('tabsController.medication_schedule.medication', {
    url: '/medication/:medication_id',
    views: {
      'timeline-tab@tabsController': {
        templateUrl: 'templates/timeline/medication.html',
        controller: 'medicationScheduleCardCtrl'
      }
    }
  })
  .state('tabsController.care_team', {
    url: '/care_team',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/care_team/index.html',
        controller: 'careTeamCtrl'
      }
    }
  })
  .state('tabsController.care_team_show', {
    url: '/care_team/:member',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/care_team/show.html',
        controller: 'careTeamCtrl'
      }
    }
  })
  .state('tabsController.notes', {
    url: '/settings/notes',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/notes.html',
        controller: 'notesCtrl'
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
  .state('tabsController.comments', {
    url: '/cards/:card_id/comments/:comment_id',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/comments.html',
        controller: 'commentsCtrl'
      }
    }
  })

  // TODO: Goals may be implemented in the future. This is meant to ask the user
  // for their personal goals.
  // .state('tabsController.goals', {
  //   url: '/goals',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/goals.html',
  //       controller: 'goalsCtrl'
  //     }
  //   }
  // })
  // .state('tabsController.addGoal', {
  //   url: '/add-goal',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/addGoal.html',
  //       controller: 'goalsCtrl'
  //     }
  //   }
  // })
  // .state('tabsController.editGoal', {
  //   url: '/goal/:goal_id',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/editGoal.html',
  //       controller: 'editGoalCtrl'
  //     }
  //   }
  // })
});
