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

/*
.constant('cardType', {
  action: 0,
  urgent: 1,
  reminder: 2
})

.constant('cardState', {
  active: 0, // when a needs to be acted upon or new reminder
  archived: 1, // when a card has been completed
  inactive: 2 // when an action item or reminder has been seen
})

.constant('cardCategory', {
  medications: 'medications',
  measurements: 'measurements',
  appointments: 'appointments',
  goals: 'goals',
  symptoms: 'symptoms'
})

ardID: 1,
    createdTimestamp: "2016-03-15T11:00:00",
    presentedTimestamp: "2016-03-15T11:00:00",
    updatedTimestamp: "2016-03-15T11:00:00", //should arrange timeline by this timestamp
    cardType: cardType.action,
    cardState: cardState.active,
    cardCategory: cardCategory.measurements,
    cardTitle: "Take Measurement",
    cardContent: "Weight, Blood Pressure and Heart Rate"
  }, {
    cardID: 2,
    createdTimestamp: "2016-03-15T12:00:00",
    presentedTimestamp: "2016-03-15T12:00:00",
    updatedTimestamp: "2016-03-15T12:00:00", //should arrange timeline by this timestamp
    cardType: cardType.reminder,
    cardState: cardState.active,
    cardCategory: cardCategory.appointments,
    cardTitle: "Appointment Reminder",
    cardContent: "Appointment with cardiologist Dr.Hart tomorrow at 9:00 AM"
  }*/
