angular.module('app.constants', [])

//just using strings for clarity/testing purposes. feel free to change to integers.
.constant('CARD', {
  TYPE: {
    'ACTION':'action',
    'URGENT':'urgent',
    'REMINDER':'reminder',
    'INFO':'info'},
  CATEGORY: {
    'MEDICATIONS_SCHEDULE': 'medications_schedule',
    'MEASUREMENTS_SCHEDULE': 'measurements_schedule',
    'APPOINTMENTS': 'appointments',
    'GOALS': 'goals',
    'SYMPTOMS_SCHEDULE': 'symptoms_schedule',
    'MEDICATIONS_CABINET':'medications_cabinet',
    'MEDICATIONS_SCHEDULE_CHANGE': 'medication_schedule_change',
    'MEASUREMENT_LOGGED':'measurement_logged'},
  TIMESPAN: {
    'GET_CURRENT_PAST': 6,
    'GET_CURRENT_FUTURE': 6,
    'GET_UPCOMING_FUTURE' : 12,
    'DAYS_BEFORE_APPT': 30, //for appointent reminder cards
    'DAYS_AFTER_APPT': 30 //for appointment history cards
  },
  REMINDER_TIME: {
    'HOUR': 7,
    'MINUTE': 0,
  }
})
.constant('DAYOFWEEK', {
  NAME: {0:'Sunday',1:'Monday',2:'Tuesday',3:'Wednesday',
        4:'Thursday',5:'Friday',6:'Saturday'}
})

.constant('TIPS',  [{
        measurement: "Weight",
        tips: []
      }, {
        measurement: "Blood Pressure",
        tips: ["Be still.",
               "Make sure you haven't had any caffeine, tobacco, or exercise in the last 30 minutes",
               "Wait one minute before taking another measurement",
               "Make sure you are sitting down, with your back supported by a chair and your feet on the floor"]
      }, {
        measurement: "Heart Rate",
        tips: []
      }]
)
