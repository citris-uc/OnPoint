angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment) {
  $scope.comments   = Comment.getByCardId($stateParams.id);
  $scope.newComment = {card_id: $stateParams.id, user_name: "Mr. A"}

  $scope.reply = function(){
    // NOTE: We copy newComment in order to avoid resetting it after the fact.
  	Comment.add(angular.copy($scope.newComment));
    $scope.comments = Comment.getByCardId($stateParams.id);
    $scope.newComment.content = "";
  }

})
