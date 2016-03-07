// Ionic Starter App
// var ionicApp = angular.module("starter", ["ionic", "ngCordova"]);

// ionicApp.run(function($ionicPlatform) {
//     $ionicPlatform.ready(function() {
//         if(window.cordova && window.cordova.plugins.Keyboard) {
//             cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//             // Don't remove this line unless you know what you are doing. It stops the viewport
//             // from snapping when text inputs are focused. Ionic handles this internally for
//             // a much nicer keyboard experience.
//             cordova.plugins.Keyboard.disableScroll(true);
//         }
//         if(window.StatusBar) {
//             StatusBar.styleDefault();
//         }
//     });
// });
 
// ionicApp.controller("EventController", function($scope, $cordovaCalendar) {
 
//     $scope.createEvent = function() {

//         var alert = document.getElementById("console");  
//         alert.innerHTML = "entered createEvent";

//         $cordovaCalendar.createEvent({
//             title: 'Space Race',
//             location: 'The Moon',
//             notes: 'Bring sandwiches',
//             startDate: new Date(2015, 0, 15, 18, 30, 0, 0, 0),
//             endDate: new Date(2015, 1, 17, 12, 0, 0, 0, 0)
//         }).then(function (result) {
//             console.log("Event created successfully");
//         }, function (err) {
//             console.error("There was an error: " + err);
//         });
//     }
 
// });


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic'])
ionicApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

ionicApp.controller("SetCalenderController", function($scope){

  var oDate = new Date();
  var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

  $scope.curDate = oDate;
  $scope.curMonth = month[oDate.getMonth()];
  $scope.cell = [];

  var firstDate = new Date();
  firstDate.setDate(1);
  var index = firstDate.getDay();
  
  for (var i = 0; i <= index; i++) {
    $scope.cell.push("");
  }
  var totalDays = new Date(oDate.getFullYear(),       oDate.getMonth() + 1, 0).getDate();
  for(var i = 1; i <= totalDays; i++){
    $scope.cell.push(i.toString());
  }
  $scope.onClickFunctions = function(eventIndex){
    if(eventIndex == "" || eventIndex == null){
      $scope.eventTitle = "no event";
      $scope.eventTime = "";
      $scope.eventLocation = "";
      $scope.eventNote = "";
    }else{
      if(eventIndex == "14"){
       $scope.eventTitle = "Appointment with cardiologist Dr.Hart";
       $scope.eventTime = "Time : Feb 2, 2016 9:00 AM to 10:30 Am";
       $scope.eventLocation = "Location : 2020 Kittredge Str, Berkeley, 94704";
       $scope.eventNote = "Note : Please bring your ID";
      }else if(eventIndex == "22"){
        $scope.eventTitle = "Appointment with nurse Denise";
        $scope.eventTime = "Time: Feb 10, 2016 9:00 AM to 10:30 Am";
        $scope.eventLocation = "Location : 517 Oxford Str, Oakaland, 06792";
        $scope.eventNote = "Note : lease bring your medication history";          
      }else if(eventIndex == "31"){
        $scope.eventTitle = "Appointment with Pharmacist Ken";
        $scope.eventTime = "Time: March 5, 2016 9:00 AM to 10:30 Am";
        $scope.eventLocation = "Location : 7814 Pingyang Str, SanFrancisco, 93501";
        $scope.eventNote = "Note : Please bring your medication history";          
      }else{
        $scope.eventTitle = "no event";
        $scope.eventTime = "";
        $scope.eventLocation = "";
        $scope.eventNote = "";
      }
    }
  }
});



