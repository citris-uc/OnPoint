angular.module('app.controllers')

.controller('resourcesCtrl', function($scope, EducationalResource, $ionicLoading) {
  $scope.resources = []

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh()
  });

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    EducationalResource.getAll().then(function(doc) {
      $scope.resources = doc.entries
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})


.controller('resourceCtrl', function($scope, EducationalResource, $stateParams, $ionicLoading) {
  $scope.resources = []

  console.log($stateParams)
  $scope.params = $stateParams

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh()
  });

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    EducationalResource.get($stateParams.path).then(function(doc) {
      $scope.resources = doc.entries
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})


.controller('resourceDownloadCtrl', function($scope, EducationalResource, $stateParams, $ionicLoading) {
  $scope.resources = []

  console.log($stateParams)
  $scope.params = $stateParams

  $scope.$on('$ionicView.loaded', function(){
    $scope.refresh()
  });

  $scope.refresh = function() {
    $ionicLoading.show({template: "<ion-spinner></ion-spinner><br>Loading...", hideOnStateChange: true})

    EducationalResource.downloadLink($stateParams.path).then(function(url) {
      $scope.params.url = url
    }).finally(function() {
      $ionicLoading.hide()
    })
  }
})
