angular.module('app.controllers',[])

.controller('medInputCtrl', function($scope, $state, $ionicPopup, Medication) {
    $scope.save = function(newMedication){
      var message;
      if( typeof newMedication === 'undefined'){
        message = "Input cannot be null";
      }else{
        if(typeof newMedication.name === 'undefined'){
          message += " name, ";
        }
        if(typeof newMedication.dosage === 'undefined'){
          message += " dosage, ";
        }
        if(typeof newMedication.timing === 'undefined'){
          message += " timing, ";
        }
        if(typeof newMedication.instructions  === 'undefined'){
          message += " instruction, ";
        }
        if(typeof newMedication.purpose  === 'undefined'){
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
         Medication.add_inputMed(newMedication);
         $state.go('medInputList');
      }

    };
})


.controller('medListCtrl', function($scope, Medication) {
   $scope.Scheduledmedications = Medication.get_inputList();
})

.controller('medInputMainCtrl', function($scope, Medication) {
})
