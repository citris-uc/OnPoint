angular.module('app.controllers')


.controller("medicationScheduleCardCtrl", function($scope, $state, $stateParams, $ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory, $ionicPopup) {
  $scope.schedule           = MedicationSchedule.findByID($stateParams.schedule_id);
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();
  $scope.medications        = Medication.get();
  // console.log($scope.schedule)
  // console.log($scope.medications)
  // console.log($scope.medicationHistory)

  if ($stateParams.medication_name) {
    var req = Medication.getByTradeName($stateParams.medication_name)
    req.then(function(snapshot) {
      $scope.medication = snapshot.val()
      $scope.medication["id"] =  snapshot.key()
    })
  }

  $scope.takeMedication = function() {
    var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take")
    req.then(function(ref) {
      $ionicHistory.goBack();
    })
  }

  $scope.skipMedication = function()  {
    var myPopup = $ionicPopup.show({
      subTitle: 'Are you sure you want to skip ' + $scope.medication.trade_name,
      scope: $scope,
      buttons: [
        { text: 'No' },
        {
          text: '<b>Yes</b>',
          onTap: function(e) {
            var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "skip");
            req.then(function(ref) { $ionicHistory.goBack();});          }
        }
      ]
    });
  };


  $scope.didTakeMed = function(trade_name) {
    var match;
    med = Medication.findMedicationByName(trade_name, $scope.medications)

    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.$id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(trade_name) {
    var match;
    var med = {}
    //Find the Med
    med = Medication.findMedicationByName(trade_name, $scope.medications)

    //then find the history instance.
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      hist = $scope.medicationHistory[i]
      if (hist && hist.medication_id == med.$id && hist.medication_schedule_id == $stateParams.schedule_id) {
        match = hist
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }

  $scope.takeAll = function(){
    for(var i = 0; i < $scope.schedule.medications.length; i++){
      if(this.didTakeMed($scope.schedule.medications[i]) == false){
        var req = Medication.getByTradeName($scope.schedule.medications[i])
        req.then(function(snapshot) {
          $scope.medication = snapshot.val()
          $scope.medication["id"] =  snapshot.key()
           var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
        })
      }
    }
    $ionicHistory.goBack();
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }


  $scope.hasTakenMeds = function() {
    takenMedCount = 0
    for (var i = 0; i < $scope.medications.length; i++) {
      if ($scope.didTakeMed($scope.medications[i].trade_name)) {
        takenMedCount++
      }
    }

    if (takenMedCount == 0)
      return false
    else
      return true
  }

  $scope.hasSkippedMeds = function() {
    count = 0
    for (var i = 0; i < $scope.medications.length; i++) {
      if ($scope.didSkipMed($scope.medications[i].trade_name)) {
        count++
      }
    }

    if (count == 0)
      return false
    else
      return true
  }

  $scope.decidedAllMeds = function() {
    count = 0
    for (var i = 0; i < $scope.medications.length; i++) {
      if (!$scope.didSkipMed($scope.medications[i].trade_name) && !$scope.didTakeMed($scope.medications[i].trade_name)) {
        count++
      }
    }

    if (count == 0)
      return false
    else
      return true
  }
})
