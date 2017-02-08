angular.module('app.controllers')

.controller('newMedicationScheduleSlotCtrl', function($scope, $state, $ionicHistory, DAYOFWEEK, Patient, Medication, MedicationSchedule, MedicationHistory, CARD, Card) {
  MedicationSchedule.get().then(function(slot) {
    $scope.schedule = slot
  })


  // TODO --> use MedicationSchedule and FB
  $scope.CARD = CARD;
  $scope.DAYOFWEEK = DAYOFWEEK;
  $scope.slot = {days:[true, true, true, true, true, true, true]};
  $scope.showError = false;
  console.log($scope.schedule)


  // Show popup when user clicks on + Add Time Slow
  // Allow user to input new name for timeslot
  // TODO -- allow user to pick days of the week for schedule
  $scope.addTimeSlot = function() {
    //console.log("$ionicHistory.currentStateName(): " + $ionicHistory.currentStateName());
    if ($scope.slot.name && $scope.slot.time) {
      $scope.slot.days = [true, true, true, true, true, true, true];
      MedicationSchedule.add($scope.slot).then(function(res) {
        $ionicHistory.goBack(-1)
      }).catch(function(err) {
        navigator.notification.alert("Something went wrong on our end. Please try again.", null, "Something went wrong", "OK")
      })

    } else {
      navigator.notification.alert("You have to enter both name and time for the new slot", null, "Invalid input", "OK")
    }
  }
})
