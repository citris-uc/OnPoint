angular.module('app.constants', [])

//just using strings for clarity/testing purposes. feel free to change to integers. 
.constant('CARD', {
  TYPE: {
    'ACTION':'action', 
    'URGENT':'urgent', 
    'REMINDER':'reminder'},
  CATEGORY: {
    'MEDICATIONS': 'medications',
    'MEASURMENTS': 'measurements',
    'APPOINTMENTS': 'appointments',
    'GOALS': 'goals',
    'SYMPTOMS': 'symptoms'}
})
