angular.module('app.controllers')
.controller("medicationScheduleCardCtrl", function($scope, $state, $stateParams, $ionicHistory, Medication, MedicationSchedule, MedicationDosage, MedicationHistory) {
  $scope.schedule           = MedicationSchedule.findByID($stateParams.schedule_id);
  $scope.medicationHistory  = MedicationHistory.getTodaysHistory();
  $scope.medications        = Medication.get();


  $scope.state = $stateParams;
  if ($stateParams.medication_name) {
    var req = Medication.getByTradeName($stateParams.medication_name)
    req.then(function(snapshot) {
      $scope.medication = snapshot.val()
      $scope.medication["id"] =  snapshot.key()
    })
  }

  $scope.takeMedication = function() {
    var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
    req.then(function(ref) {
      var alertPopup = $ionicPopup.alert({
        title: 'Success',
        template: 'You have succesfully taken ' + $scope.medication.trade_name
      });

      alertPopup.then(function(res) {
        $ionicHistory.goBack();
      });
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


  $scope.didTakeMed = function(medication) {
    var match;
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.taken_at !== undefined);
    else
      return false;
  }

  $scope.didSkipMed = function(medication) {
    var match;
    var med = {}
    //Find the Med
    for(var i = 0; i < $scope.medications.length; i++) {
      if ($scope.medications[i].trade_name == medication) {
        med.id = $scope.medications[i].$id;
      }
    }

    //then find the history instance.
    for(var i = 0; i < $scope.medicationHistory.length; i++) {
      if ($scope.medicationHistory[i].medication_id == med.id && $scope.medicationHistory[i].medication_schedule_id == $stateParams.schedule_id) {
        match = $scope.medicationHistory[i]
      }
    }

    if (match)
      return (match.skipped_at !== undefined);
    else
      return false;
  }

  /*
   * Can get to templates/medications/schedule.html in 2 ways so need to direct approrpiately when click a specific med
   * rather than having a hard coded ui-sref like below
   * ui-sref="tabsController.medicationAction({schedule_id: schedule.$id, medication_name: med})"
   * ui-sref="tabsController.medication({schedule_id: schedule.$id, medication_name: med})"
   */
  // $scope.directToMed = function(schedule, med_name) {
  //   var params =  {schedule_id: schedule, medication_name: med_name};
  //
  //   if($ionicHistory.backView().stateName=='tabsController.timeline')
  //     $state.go('tabsController.medicationAction',params)
  //   else if ($ionicHistory.backView().stateName=='tabsController.medications')
  //     $state.go('tabsController.medication',params)
  //
  // }

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

  $scope.state = $stateParams;
  var req = Medication.getByTradeName($stateParams.medication_name)
  req.then(function(snapshot) {
    $scope.medication = snapshot.val()
    $scope.medication["id"] =  snapshot.key()
  })
  $scope.schedule   = MedicationSchedule.findByID($stateParams.schedule_id)

  $scope.takeMedication = function() {
    var req = MedicationHistory.create_or_update($scope.medication, $scope.schedule, "take");
    req.then(function(ref) {
      var alertPopup = $ionicPopup.alert({
        title: 'Success',
        template: 'You have succesfully taken ' + $scope.medication.trade_name
      });

      alertPopup.then(function(res) {
        $ionicHistory.goBack();
      });
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

  $scope.containMeds = function(){
    if( typeof $scope.schedule.medications === "undefined"){
      return false;
    }
    for(var i = 0; i < $scope.schedule.medications.length; i++ ) {
      if(this.didTakeMed($scope.schedule.medications[i]) == false){
        return true;
      }
    }
    return false;
  }
})
