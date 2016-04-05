angular.module('app.controllers')

.controller('medInputCtrl', function($scope, $state, $ionicPopup, $templateCache, Medication) {
    $scope.newMedication = {};
    $scope.save = function(){
      var message;
      if( typeof $scope.newMedication === 'undefined'){
        message = "Input cannot be null";
      }else{
        if(typeof $scope.newMedication.name === 'undefined'){
          message += " name, ";
        }
        if(typeof $scope.newMedication.dosage === 'undefined'){
          message += " dosage, ";
        }
        if(typeof $scope.newMedication.timing === 'undefined'){
          message += " timing, ";
        }
        if(typeof $scope.newMedication.instructions  === 'undefined'){
          message += " instruction, ";
        }
        if(typeof $scope.newMedication.purpose  === 'undefined'){
          message += " purpose, ";
        }
      }
      if(message != null){
        var myPopup = $ionicPopup.show({
          title: "Invalid input",
          subTitle: message,
          scope: $scope,
          buttons: [
            {text: '<b>OK</b>'}
          ]
        });
      }else{
         Medication.add_inputMed($scope.newMedication);
         $state.go('medInputList');
      }

    };
})


.controller('medListCtrl', function($scope, Medication) {
   $scope.Scheduledmedications = Medication.get_inputList();
   $scope.test = Medication.get_inputList();
})

.controller('medInputMainCtrl', function($scope, Medication) {
})

.controller('medFillMainCtrl', function($scope, Medication) {
})
