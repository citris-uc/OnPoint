angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment) {
  $scope.cardId = $stateParams.cardId;
  $scope.comments = Comment.getByCardId($stateParams.cardId);
})