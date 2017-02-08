angular.module('app.services')
.factory("FirebaseDB", ["firebase", function(firebase) {
  return {
    patientsDB: new Firebase(onpoint.env.mainURL + "patients/")
  };
}])
