angular.module('app.services')

.factory('Patient', function() {
  var patients = [{
    id: 1, 
    email: ucb.onpoint@gmail.com, 
    name: ucb onpoint, 
    photo: 'profile_default.png', 
    token: null
  }];

  return {
    get: function() {
      return patients;
    }
  };
})
