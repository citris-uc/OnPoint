angular.module('app.controllers')

.controller('notesCtrl', function($scope, Notes, CARD) {
  var today = new Date();
  var fromDate = new Date();
  //get notes in past 'GET_CURRENT_PAST' days.
  fromDate.setDate(fromDate.getDate()-CARD.TIMESPAN.GET_CURRENT_PAST);
  $scope.notes = Notes.get(fromDate, today);

  /*
   * We store dates in firebase in ISO format which is zero UTC offset
   * therefore we cannot simply display the date that is stored in firebase, we need to display local time
   */
  $scope.setLocaleDate = function(utc_date) {
    var iso = (new Date()).toISOString(); //get current ISO String
    var iso_altered = utc_date.concat(iso.substring(10)); //replace date portion with date from firebase
    var local = new Date(iso_altered); //Date() constructor automatically sets local time!
    return local
  }


})
