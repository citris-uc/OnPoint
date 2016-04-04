angular.module('app.controllers', ['ionic', 'ionic-datepicker','ionic-timepicker'])

.controller('appointmentCtrl', function($scope,$stateParams, Appointment) {
  var appointmentRecord = Appointment.get();
  $scope.appointment = appointmentRecord[parseInt($stateParams.appointmentId)];
})

.controller('addAppointmentCtrl', function($scope,$state,$stateParams,$ionicPopup,ionicDatePicker,ionicTimePicker, Appointment) {
   $scope.newAppointment = {};
   $scope.datePicker = function(){
     var ipObj1 = {
      callback: function (val) {  //Mandatory
        var selectedDate = new Date(val);
        $scope.newAppointment.date = selectedDate.getFullYear() + "-" + selectedDate.getMonth() + "-" + selectedDate.getDate();
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
    ionicDatePicker.openDatePicker(ipObj1);
   }
   $scope.timePicker = function(){
     var ipObj1 = {
     callback: function (val) {      //Mandatory
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          var selectedTime = new Date(val * 1000);
          if(selectedTime.getUTCMinutes() < 10){
            $scope.newAppointment.time = selectedTime.getUTCHours() + ":0" + selectedTime.getUTCMinutes();
          }else{
            $scope.newAppointment.time = selectedTime.getUTCHours() + ":" + selectedTime.getUTCMinutes();
          }
        }
      },
      inputTime: 50400,   //Optional
      format: 12,         //Optional
      step: 15,           //Optional
      setLabel: 'Set2'    //Optional
     };

     ionicTimePicker.openTimePicker(ipObj1);
   }
   $scope.save = function(){
     var message = "";
     if(typeof $scope.newAppointment.title === 'undefined'){
       message += " title cannot be empty <br/>";
     }
     if(typeof $scope.newAppointment.location === 'undefined'){
       message += " location cannot be empty <br/>";
     }
     if(typeof $scope.newAppointment.date === 'undefined'){
       message += " date cannot be empty <br/>";
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
      $scope.newAppointment.timestamp = $scope.newAppointment.date+"T"+$scope.newAppointment.time+":00"
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
