angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/tabs/timeline')

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

  .state('tabsController.surveys', {
    url: '/surveys',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/surveys/index.html',
        controller: 'surveyCtrl'
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

  .state('tabsController.medication_schedule', {
    url: '/timeline/medication_schedule/:schedule_id?:card_id',
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



  // TODO: Deprecate these
  // .state('tabsController.medication', {
  //   url: '/medications/schedule/:schedule_id/medication/:medication_id',
  //   views: {
  //     'medications-tab': {
  //       templateUrl: 'templates/medications/show.html',
  //       controller: 'medicationCtrl'
  //     }
  //   }
  // })

  .state('tabsController.takeCabMed', {
    url: '/medications/schedule/:schedule_id/medication/:medication_name',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/take_cab_med.html',
        controller: 'cabMedTakeCtrl'
      }
    }
  })

  .state('tabsController.newCabinetMed', {
    url: '/medications/newCabinet',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/new_cabmed.html',
        controller: 'cabmedInputCtrl'
      }
    }
  })

  .state('tabsController.editMed', {
    url: '/medication/:medication_id',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/edit_medication.html',
        controller: 'medicationEditCtrl'
      }
    }
  })


  // .state('tabsController.measurementAction', {
  //   url: '/timeline/measurement-action/:schedule_id',
  //   views: {
  //     'timeline-tab': {
  //       templateUrl: 'templates/measurements/measurements-add.html',
  //       controller: 'addMeasurementsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.measurementActionTips', {
  //   url: '/measurement-tips',
  //   views: {
  //     'timeline-tab': {
  //       templateUrl: 'templates/measurements/measurementTips.html',
  //       controller: 'measurementTipsCtrl'
  //     }
  //   }
  // })


  .state('tabsController.notes', {
    url: '/settings/notes',
    views: {
      'timeline-tab': {
        templateUrl: 'templates/notes.html',
        controller: 'notesCtrl'
      }
    }
  })

  // .state('tabsController.medications', {
  //   url: '/medications',
  //   views: {
  //     'medications-tab': {
  //       templateUrl: 'templates/medications/medications.html',
  //       controller: 'medicationsCtrl'
  //     }
  //   }
  // })

  .state('tabsController.medicationsSchedule', {
    url: '/medications/:schedule_id',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/schedule.html',
        controller: 'medicationScheduleCtrl'
      }
    }
  })

  .state('tabsController.editMedSchedule', {
    url: '/medication_schedules/generated',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/edit_medication_schedule.html',
        controller: 'medicationsSettingCtrl'
      }
    }
  })

  .state('tabsController.newScheduleSlot', {
    url: '/medication_schedules/new_slot',
    views: {
      'medications-tab': {
        templateUrl: 'templates/medications/new_time_slot.html',
        controller: 'medicationsSettingCtrl'
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


  // .state('tabsController.measurements', {
  //   url: '/measurements',
  //   views: {
  //     'measurements-tab': {
  //       templateUrl: 'templates/measurements/measurements.html',
  //       controller: 'measurementsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.viewMeasurementSchedule', {
  //   url: 'measurements/schedule/:measurement_schedule_id',
  //   views: {
  //     'measurements-tab': {
  //       templateUrl: 'templates/measurements/view_measurement_schedule.html',
  //       controller: 'measurementViewCtrl'
  //     }
  //   }
  // })

  // DEPRECIATED: Making measurements tab a segmenetd control
  // .state('tabsController.measurementAdd', {
  //   url: '/measurement-add/:schedule_id',
  //   views: {
  //     'measurements-tab': {
  //       templateUrl: 'templates/measurements/measurements-add.html',
  //       controller: 'addMeasurementsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.measurementTips', {
  //   url: '/measurement-tips',
  //   views: {
  //     'measurements-tab': {
  //       templateUrl: 'templates/measurements/measurementTips.html',
  //       controller: 'measurementTipsCtrl'
  //     }
  //   }
  // })

  // .state('tabsController.appointments', {
  //   url: '/appointments',
  //   views: {
  //     'appointments-tab': {
  //       templateUrl: 'templates/appointments/appointments.html',
  //       controller: 'appointmentsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.appointment', {
  //   url: '/appointment/:date/:appointment_id',
  //   views: {
  //     'timeline-tab': {
  //       templateUrl: 'templates/appointments/appointment.html',
  //       controller: 'appointmentCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.addAppointment', {
  //   url: '/add-appointment',
  //   views: {
  //     'appointments-tab': {
  //       templateUrl: 'templates/appointments/addAppointment.html',
  //       controller: 'addAppointmentCtrl'
  //     }
  //   }
  // })

  // .state('tabsController.editAppointment', {
  //   url: '/edit-appointment/:date/:appointment_id',
  //   views: {
  //     'appointments-tab': {
  //       templateUrl: 'templates/appointments/editAppointment.html',
  //       controller: 'editAppointmentCtrl'
  //     }
  //   }
  // })

  // .state('tabsController.goals', {
  //   url: '/goals',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/goals.html',
  //       controller: 'goalsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.addGoal', {
  //   url: '/add-goal',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/addGoal.html',
  //       controller: 'goalsCtrl'
  //     }
  //   }
  // })
  //
  // .state('tabsController.editGoal', {
  //   url: '/goal/:goal_id',
  //   views: {
  //     'goals-tab': {
  //       templateUrl: 'templates/editGoal.html',
  //       controller: 'editGoalCtrl'
  //     }
  //   }
  // })

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
