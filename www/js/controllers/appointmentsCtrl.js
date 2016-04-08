angular.module('app.controllers')

.controller('appointmentCtrl', function($scope,$stateParams, Appointment) {
  var appointmentRecord = Appointment.get();
  $scope.appointment = appointmentRecord[parseInt($stateParams.appointmentId)];
})

.controller('addAppointmentCtrl', function($scope,$state,$stateParams,$ionicPopup, Appointment) {
   $scope.newAppointment = {};
   $scope.newAppointment.timestamp = new Date();
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
        $scope.newAppointment.note = "";
      }
      Appointment.add($scope.newAppointment);
      $state.transitionTo('tabsController.appointments', {reload: true});
     }

   };
})

.controller('appointmentsCtrl', function($scope, $location, $state, Appointment) {
  console.log('inside appointmentsCtrl');
  var appointmentRecord = Appointment.get();
  console.log('appointments are ', appointmentRecord);

  $scope.eventDates = []

  // TODO: Shouldn't this be moved into a convenience method of Appointment factory?
  for(var i = 0; i < appointmentRecord.length; i++){
    var oneEventDay = new Date(appointmentRecord[i].timestamp);
    $scope.eventDates.push(oneEventDay.getDate());
  }

  $scope.hasAppointment = function(day) {
    return ($scope.eventDates.indexOf(parseInt(day)) !== -1);
  }

  $scope.transitionToAppointment = function(day){
    var index = $scope.eventDates.indexOf(parseInt(day)).toString();
    if(index > -1)
      $state.go('tabsController.appointment', {appointmentId: index});
  }

  // TODO: This is way too verbose and should be moved into Appointment factory.
  var oDate = new Date();
  $scope.curDate = oDate;
  $scope.today = oDate.getDate();

  var firstDate = new Date();
  firstDate.setDate(1);
  var totalDays = new Date(oDate.getFullYear(),       oDate.getMonth() + 1, 0).getDate();
  $scope.weeks = [];

  var numWeeks = totalDays/7;
  var day = 1;
  for(var i = 0; i < numWeeks; i++){
    $scope.weeks[i] = [];
    for(var j = 0; j < 7; j++){
       if(i == 0 && j < firstDate.getDay()){
          $scope.weeks[i].push("");
       }else{
          if(day <= totalDays){
              $scope.weeks[i].push(day.toString());
          }else{
              $scope.weeks[i].push("");
          }
          day++;
       }
    }
  }
})
