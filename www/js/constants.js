angular.module('app.constants', [])

//just using strings for clarity/testing purposes. feel free to change to integers. 
.constant('CARD', {
  TYPE: {
    'ACTION':'action', 
    'URGENT':'urgent', 
    'REMINDER':'reminder'},
  CATEGORY: {
    'MEDICATIONS_SCHEDULE': 'medications_schedule',
    'MEASUREMENTS_SCHEDULE': 'measurements_schedule',
    'APPOINTMENTS': 'appointments',
    'GOALS': 'goals',
    'SYMPTOMS_SCHEDULE': 'symptoms_schedule'}
})
