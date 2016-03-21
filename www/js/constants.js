angular.module('app.constants', [])

.constant('cardType', {
  action: 0,
  urgent: 1,
  reminder: 2
})

.constant('cardState', {
  active: 0, // when a needs to be acted upon or new reminder
  archived: 1, // when a card has been completed
  inactive: 2 //when an action item or reminder has been seen
})

.constant('cardCategory', {
  medications: 0,
  measurements: 1,
  appointments: 2,
  goals: 3,
  symptoms: 4
})
