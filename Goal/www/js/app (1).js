// Ionic Starter App

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
  $scope.curDate = oDate;
  
});

ionicApp.controller("ListCtrl", function($scope) {

  $scope.IsVisible = false;
  $scope.buttonContent = "Add a personal goal";
  $scope.addItem = function(){
    if($scope.IsVisible == false){
      $scope.IsVisible = true;
      $scope.buttonContent = "Add"
    }else{
      $scope.IsVisible = false;
      $scope.groups[1].items.push($scope.newGoal);
      $scope.groups[1].size++;
      $scope.buttonContent = "Add a personal goal";
      $scope.newGoal = null;
    }
  }

  $scope.groups = [];

  $scope.groups[0] = {
      name: "Clinical Goals",
      size: 0,
      items: []
  };
  $scope.groups[0].items.push("Control blood pressure to lower than 130/80 mm Hg");
  $scope.groups[0].items.push("Keep HbA1C levels at 7% or less ");
  $scope.groups[0].items.push("Keep heart rate between 90-120 bpm");
  $scope.groups[0].items.push("Tolerate all heart failure medications ");
  $scope.groups[0].items.push("Lower LDL cholesterol levels to below 100 mg/dL");
  $scope.groups[0].items.push("Decrease anxiety levels ");
  $scope.groups[0].size = 6;

  $scope.groups[1] = {
    name: "Personal Goals",
    size: 0,
    items: []
  };

  $scope.groups[1].items.push("Remain independent");
  $scope.groups[1].items.push("Keep visiting with friends and doing my daily activities");
  $scope.groups[1].items.push("Be able to visit out-of-town family by plane");
  $scope.groups[1].items.push("Feel healthy");
  $scope.groups[1].size = 4;
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  
});