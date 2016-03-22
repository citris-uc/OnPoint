angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment) {
  $scope.comments = Comment.getByCardId($stateParams.cardId);

  $scope.reply = function(replyContent){
  	new_comment = {};
  	new_comment.cardId = $stateParams.cardId;
  	new_comment.timestamp = new Date();
  	new_comment.user_name = "Mr.A";
  	new_comment.content = replyContent;
  	Comment.add(new_comment);
  	$scope.comments = Comment.getByCardId($stateParams.cardId);
  	$scope.replyContent = "";
  }

})