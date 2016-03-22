angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment) {
  $scope.comments = Comment.getByCardId($stateParams.id);

  $scope.reply = function(replyContent){
  	new_comment = {};
  	new_comment.cardId = $stateParams.id;
  	new_comment.user_name = "Mr.A";
  	new_comment.content = replyContent;
  	Comment.add(new_comment);
  	$scope.comments = Comment.getByCardId($stateParams.id);
  	$scope.replyContent = "";
  }

})
