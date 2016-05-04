angular.module('app.controllers')

.controller('appointmentCtrl', function($scope,$stateParams, Appointment) {
  $scope.appointment = Appointment.getById($stateParams.date,$stateParams.appointment_id);
})

.controller('addAppointmentCtrl', function($scope,$state,$stateParams,$ionicPopup, Appointment) {
   $scope.newAppointment = {};
   $scope.newAppointment.time = new Date();
   $scope.save = function(){
     var message = "";
     if(typeof $scope.newAppointment.title === 'undefined'){
       message += " title cannot be empty <br/>";
     }
     if(typeof $scope.newAppointment.location === 'undefined'){
       message += " location cannot be empty <br/>";
     }
     if(message != ""){
       var myPopup = $ionicPopup.show({
         title: "Invalid input",
         subTitle: message,
         scope: $scope,
         buttons: [
           {text: '<b>OK</b>'}
         ]
       });
     }else{
      if(typeof $scope.newAppointment.note === 'undefined'){
        $scope.newAppointment.note = null;
      }
      Appointment.add($scope.newAppointment);
      $state.transitionTo('tabsController.appointments', {reload: true});
     }

   };
})

.controller('appointmentsCtrl', function($scope, $location, $state, Appointment, CARD) {
  var fromDate = new Date();
  var toDate = new Date();
  fromDate.setDate(fromDate.getDate()-CARD.TIMESPAN.DAYS_AFTER_APPT);
  toDate.setDate(toDate.getDate()+CARD.TIMESPAN.DAYS_BEFORE_APPT);
  $scope.appointments = Appointment.getAppointmentsFromTo(fromDate, toDate);
  $scope.appointments.$loaded().then(function() {
    console.log($scope.appointments)
  })
  $scope.hasAppointment = function(){
    if($scope.appointments.length == 0){
      return false;
    }else{
      return true;
    }
  }

  /*
   * We store dates in firebase in ISO format which is zero UTC offset
   * therefore we cannot simply display the date that is stored in firebase, we need to display local time
   */
  $scope.setLocaleDate = function(utc_date) {
    var iso = (new Date()).toISOString(); //get current ISO String
    var iso_altered = utc_date.concat(iso.substring(10)); //replace date portion with date from firebase
    var local = new Date(iso_altered); //Date() constructor automatically sets local time!
    return local;
  }
  // console.log('appointments are ', appointmentRecord);
  //
  // $scope.eventDates = []
  //
  // // TODO: Shouldn't this be moved into a convenience method of Appointment factory?
  // for(var i = 0; i < appointmentRecord.length; i++){
  //   var oneEventDay = new Date(appointmentRecord[i].timestamp);
  //   $scope.eventDates.push(oneEventDay.getDate());
  // }
  //
  // $scope.hasAppointment = function(day) {
  //   return ($scope.eventDates.indexOf(parseInt(day)) !== -1);
  // }
  //
  // $scope.transitionToAppointment = function(day){
  //   var index = $scope.eventDates.indexOf(parseInt(day)).toString();
  //   if(index > -1)
  //     $state.go('tabsController.appointment', {appointmentId: index});
  // }
  //
  // // TODO: This is way too verbose and should be moved into Appointment factory.
  // var oDate = new Date();
  // $scope.curDate = oDate;
  // $scope.today = oDate.getDate();
  //
  // var firstDate = new Date();
  // firstDate.setDate(1);
  // var totalDays = new Date(oDate.getFullYear(),       oDate.getMonth() + 1, 0).getDate();
  // $scope.weeks = [];
  //
  // var numWeeks = totalDays/7;
  // var day = 1;
  // for(var i = 0; i < numWeeks; i++){
  //   $scope.weeks[i] = [];
  //   for(var j = 0; j < 7; j++){
  //      if(i == 0 && j < firstDate.getDay()){
  //         $scope.weeks[i].push("");
  //      }else{
  //         if(day <= totalDays){
  //             $scope.weeks[i].push(day.toString());
  //         }else{
  //             $scope.weeks[i].push("");
  //         }
  //         day++;
  //      }
  //   }
  // }
})
