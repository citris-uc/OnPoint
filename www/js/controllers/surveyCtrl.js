angular.module('app.controllers')

.controller('surveyCtrl', function($scope, $ionicModal, irkResults, Survey, $ionicLoading) {
  $scope.survey = {}
  $scope.surveys = []

  $scope.$on('$ionicView.loaded', function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Survey.getAll().then(function(doc) {
      $scope.surveys = doc
    }).finally(function() {
      $ionicLoading.hide()
    })
  });

  $scope.showModal = function(survey) {
    if (survey.completed_at) {
      navigator.notification.alert("You've already completed this survey. Please wait a week.", null)
      return
    }

    // Load the appropriate survey.
    if (survey.$id == "costars") {
      template = "templates/surveys/costars.html"
    } else if (survey.$id == "anxiety") {
      template = "templates/surveys/anxiety.html"
    }

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading survey...", hideOnStateChange: true})

    return $ionicModal.fromTemplateUrl(template, {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.survey = survey
      $scope.modal  = modal;
      return modal.show()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.closeModal = function() {
    console.log("Finished...")
    $scope.modal.hide()
    window.test = irkResults
    console.log(irkResults.getResults())
    console.log("Saving survey with Firebase ID: " + $scope.survey.$id)
    console.log($scope.survey)
    console.log("-----------")

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving survey...", hideOnStateChange: true})
    Survey.save($scope.survey.$id, irkResults.getResults()).catch(function(err) {
      console.log("Error")
      console.log(err)
    }).finally(function() {
      $scope.survey = {}
      $ionicLoading.hide()
    })
  }

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})


    Survey.createIfEmpty().then(function() {
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function(err) {
      navigator.notification.alert(JSON.stringify(err), null)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
