angular.module('app.controllers',[])

.controller('medInputCtrl', function($scope, $state, Medication) {
    $scope.save = function(newMedication){
  		Medication.addMed(newMedication);
  		$state.go('medInputList');
    };
})


.controller('medListCtrl', function($scope, Medication) {
   $scope.Scheduledmedications = Medication.get();
})

.controller('medInputMainCtrl', function($scope, Medication) {
})


