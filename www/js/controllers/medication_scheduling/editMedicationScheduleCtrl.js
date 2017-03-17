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

  // $scope.timeDisplayFormat = function(timestring) {
  //   [hours, mins] = timestring.split(':');
  //   hours = parseInt(hours);
  //   ampm = (hours >= 12) ? "PM" : "AM";
  //   hours = (hours > 12) ? hours - 12 : hours;
  //   newtime = hours + ":" + mins + " " + ampm;
  //   return newtime;
  // }

  $scope.update = function() {
    // $scope.slot.days = slot.days;
    // $scope.slot.time = $scope.formatTimeObj($scope.slot.time);

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




    // TODO -> allow user to pick dates for schedule
    // hours = $scope.slot.time.getHours();
    // mins  = $scope.slot.time.getMinutes();
    // hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) );
    // mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) );
    // $scope.schedule[index].slot = $scope.slot.text;
    // $scope.schedule[index].days = $scope.slot.days;
    // $scope.schedule[index].time = hours + ":" + mins;
    // if ($scope.slot.name && $scope.slot.time) {
    //   hours = $scope.slot.time.getHours();
    //   mins  = $scope.slot.time.getMinutes();
    //   hours = ( String(hours).length == 1 ? "0" + String(hours) : String(hours) );
    //   mins  = ( String(mins).length == 1 ? "0" + String(mins) : String(mins) );
    //   slot = {name: $scope.slot.name, days: $scope.slot.days}
    //   slot.time = hours + ":" + mins;
    //   var req = $scope.slot.$save($scope.slot);
    //   req.then(function(snapshot) {
    //     var today    = new Date();
    //     var tomorrow = new Date();
    //     tomorrow.setDate(tomorrow.getDate() + 1);
    //     Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.slot, today.toISOString());
    //     Card.updateSchedCard(CARD.CATEGORY.MEDICATIONS_SCHEDULE, snapshot.key(), $scope.slot, tomorrow.toISOString());
    //     $ionicHistory.goBack()
    //   })
    // }
  }

})
