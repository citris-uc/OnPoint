angular.module('app.controllers')

.controller('medicationsCtrl', function($scope, MedicationSchedule, MedicationHistory) {
  $scope.schedule = MedicationSchedule.get();

  $scope.hasTaken = function(med_id, slot) {
    now = new Date().toDateString();
    //console.log(med_id, slot);
    status = MedicationHistory.check(med_id, slot, now);
    if (status == 'taken') {
      return true;
    }
    return false;
  }

  $scope.getColor = function(med_id, slot) {
    now = new Date().toDateString();
    status = MedicationHistory.check(med_id, slot, now);
    if (status == 'skipped') {
      return 'grey';
    }
    return 'black';
  }
})
.controller("medicationScheduleCtrl", function($scope, $stateParams, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.schedule = MedicationSchedule.get()[$scope.state.schedule];

  $scope.hasTaken = function(med_id, slot) {
    now = new Date().toDateString();
    status = MedicationHistory.check(med_id, slot, now);
    if (status == 'taken') {
      return true;
    }
    return false;
  }

  $scope.getColor = function(med_id, slot) {
    now = new Date().toDateString();
    status = MedicationHistory.check(med_id, slot, now);
    if (status == 'skipped') {
      return 'grey';
    }
    return 'black';
  }

})
.controller("medicationCtrl", function($scope, $stateParams,$ionicPopup,$ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.state = $stateParams;
  $scope.medication = Medication.getByName($stateParams.medicationName);
  $scope.dosage     = MedicationDosage.getByName($stateParams.medicationName);


  $scope.take = function(med_id, slot, med_name) {
    var now = new Date();
    MedicationHistory.add(med_id, now.toDateString(), slot, now, null);
    var alertPopup = $ionicPopup.alert({
      title: 'Success',
      template: 'You have succesfully taken ' + med_name
    });

    alertPopup.then(function(res) {
      $ionicHistory.goBack(); //calling back button manually.
    });
  }

  $scope.skip = function(med_id,slot, med_name)  {
  var now = new Date();
  var myPopup = $ionicPopup.show({
    subTitle: 'Are you sure you want to skip ' + med_name,
    scope: $scope,
    buttons: [
      { text: 'No'
      },
      {
        text: '<b>Yes</b>',
        onTap: function(e) {
          MedicationHistory.add(med_id, now.toDateString(), slot, null, now);
          $ionicHistory.goBack(); //calling back button manually.
        }

      }
    ]
  });
 };
})
