angular.module('app.controllers')

.controller('surveyCtrl', function($scope, $ionicModal, irkResults, Survey, $ionicLoading) {
  $scope.survey  = {}
  $scope.surveys = []

  $scope.days    = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  $scope.slot    = { days: [false, false, false, false, false, false, false] };

  $scope.$on('$ionicView.loaded', function(){
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    Survey.getAll().then(function(doc) {
      $scope.surveys = doc
    }).then(function() {
      return Survey.getSchedule()
    }).then(function(slot) {
      if (slot.time)
        slot.time = moment(slot.time, "HH:mm").toDate()
      $scope.slot = slot
    }).finally(function() {
      $ionicLoading.hide()
    })
  });

  $scope.saveSchedule = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Saving...", hideOnStateChange: true})

    if (!$scope.slot.time) {
      navigator.notification.alert("Time can't be blank", null)
      $ionicLoading.hide()
      return
    }
    $scope.slot.time = moment($scope.slot.time).format('HH:mm');

    return Survey.updateSchedule($scope.slot).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.showScheduleModal = function() {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/surveys/schedule.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      modal.show()
    });
  }

  $scope.showModal = function(survey) {
    // Load the appropriate survey.
    template = "templates/surveys/" + survey.$id + ".html"

    console.log("Showing survey: ")
    console.log(survey)
    console.log("-----")

    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading survey...", hideOnStateChange: true})

    return $ionicModal.fromTemplateUrl(template, {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      irkResults.initResults()
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


    if ($scope.survey.$id == "Symptoms") {
      Survey.saveSymptomsQuestionnaire($scope.survey.$id, irkResults.getResults()).catch(function(err) {
        console.log("Error")
        console.log(err)
      }).finally(function() {
        $scope.survey = {}
        $ionicLoading.hide()
      })
    } else  {
      Survey.save($scope.survey.$id, irkResults.getResults()).catch(function(err) {
        console.log("Error")
        console.log(err)
      }).finally(function() {
        $scope.survey = {}
        $ionicLoading.hide()
      })
    }
  }

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})


    Survey.getAll().then(function(doc) {
      $scope.surveys = doc
      $scope.$broadcast('scroll.refreshComplete');
    }).catch(function(err) {
      navigator.notification.alert(JSON.stringify(err), null)
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
