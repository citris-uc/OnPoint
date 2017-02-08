angular.module('app.controllers')


.controller('medicationsListCtrl', function($scope, $state, Patient, Medication, MedicationSchedule, Onboarding, $ionicLoading) {
   $scope.generateDefaultMeds = function() {
     Medication.setDefaultMeds()
     $state.go("medication_identification.start", {}, {reload: true})
   }

   $scope.completeMedicationIdentification = function() {
     $ionicLoading.show({hideOnStateChange: true})
     MedicationSchedule.setDefaultSchedule().then(function(res) {
       $ionicLoading.hide()
       Onboarding.update({'medication_identification':true}).then(function(response) {
         $state.go("medication_scheduling.start")
       }).catch(function(err) {
         $scope.$emit(onpoint.env.auth.failure, {})
       })
     }).catch(function(res) {
       $ionicLoading.hide()
     })
   }


   $scope.$on("$ionicView.loaded", function() {
     $ionicLoading.show({hideOnStateChange: true})
     Medication.get().then(function(meds) {
       $ionicLoading.hide()
       $scope.scheduledMedications = meds
     })
   })



  //  $scope.disableGenerate = function() {
  //    return ($scope.scheduledMedications.length == 0)
  //  }
})
