angular.module('app.controllers')

.controller('careTeamCtrl', function($scope, $ionicModal, $ionicLoading, CareTeam, $firebaseObject) {
  $scope.care_team = []
  $scope.member = {}

  $scope.$on('$ionicView.loaded', function(){
    CareTeam.getAll().then(function(care_team) {
      console.log(care_team)
      $scope.care_team = care_team
    })
  });

  $scope.showNewModal = function() {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/care_team/new.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.modal = modal;
      return modal.show()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.showEditModal = function(member) {
    // Create the login modal that we will use later
    return $ionicModal.fromTemplateUrl('templates/care_team/edit.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.member = member

      $scope.modal = modal;
      return modal.show()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }


  $scope.closeModal = function() {
    $scope.modal.hide();
  }

  $scope.addMember = function() {
    if (!$scope.member.name) {
      alert("Please enter a name")
      return
    }

    if (!$scope.member.title) {
      alert("Please enter a title")
      return
    }

    $ionicLoading.show({hideOnStateChange: true})

    CareTeam.add($scope.member).then(function() {
      $scope.member = {}
      $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.updateMember = function() {
    if (!$scope.member.name) {
      alert("Please enter a name")
      return
    }

    if (!$scope.member.title) {
      alert("Please enter a title")
      return
    }

    $ionicLoading.show({hideOnStateChange: true})

    CareTeam.update($scope.member).then(function() {
      $scope.member = {}
      $scope.closeModal()
    }).finally(function() {
      $ionicLoading.hide()
    })
  }

  $scope.destroy = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Deleting...", hideOnStateChange: true})

    CareTeam.destroy($scope.member).then(function() {
      return $scope.closeModal()
    }).finally(function() {
      $scope.member = {}
      $ionicLoading.hide()
    })
  }
})
