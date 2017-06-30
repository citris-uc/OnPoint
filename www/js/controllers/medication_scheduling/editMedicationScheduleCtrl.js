angular.module('app.controllers')

.controller('editMedicationScheduleSlotCtrl', function($scope, $state, $ionicPopup, $ionicHistory, Patient, Medication, MedicationSchedule, MedicationHistory, Card, moment, $ionicLoading) {
  $scope.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  $scope.$on("$ionicView.loaded", function() {
    $ionicLoading.show({hideOnStateChange: true})

    MedicationSchedule.getByID($state.params.id).then(function(slot) {
      if (slot.time)
        slot.time = moment(slot.time, "HH:mm").toDate()
      $scope.slot = slot;
    }).finally(function() {
      $ionicLoading.hide();
    })
  })

  $scope.removeSlot = function() {
    $scope.slot.$remove().then(function(response) {
      $ionicHistory.goBack(-1)
    }).catch(function(response) {
      $scope.$emit(onpoint.error, response)
    })
  }

  $scope.update = function() {
    if (!$scope.slot.name) {
      alert("Name can't be blank")
      return
    }
    if (!$scope.slot.time) {
      alert("Time can't be blank")
      return
    }

    console.log($scope.slot)

    $scope.slot.time = moment($scope.slot.time).format('HH:mm');

    var req = $scope.slot.$save().then(function(snapshot) {
      $ionicHistory.goBack(-1)
    }).catch(function(res) {
      $scope.$emit(onpoint.error, res)
    })
  }

})
