angular.module('app.controllers')

.controller('newMedicationScheduleSlotCtrl', function($scope, $state, $ionicHistory, Patient, Medication, MedicationSchedule, MedicationHistory, Card, $ionicLoading) {
  $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  $scope.slot = { days: [true, true, true, true, true, true, true] };

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({hideOnStateChange: true})

    MedicationSchedule.get().then(function(slot) {
      $scope.schedule = slot
    }).finally(function() {
      $ionicLoading.hide()
    })
  })

  // Show popup when user clicks on + Add Time Slow
  // Allow user to input new name for timeslot
  // TODO -- allow user to pick days of the week for schedule
  $scope.addTimeSlot = function() {
    if ($scope.slot.name && $scope.slot.time) {

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
