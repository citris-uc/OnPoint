angular.module('app.constants', [])

.constant('card.type', {
  action: 0,
  urgent: 1,
  reminder: 2
})

.constant('card.state', {
  active: 0, // when a needs to be acted upon or new reminder
  archived: 1, // when a card has been completed
  inactive: 2 // when an action item or reminder has been seen
})

.constant('card.category', {
  medications: 'medications',
  measurements: 'measurements',
  appointments: 'appointments',
  goals: 'goals',
  symptoms: 'symptoms'
})
