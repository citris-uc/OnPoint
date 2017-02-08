angular.module('app.services')
.factory('Pouch', [function() {
  return {
    patientsDB: new PouchDB("patients"),
  };
}]);
