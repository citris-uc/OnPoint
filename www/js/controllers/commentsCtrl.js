angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment, Card) {
  $scope.card = Card.getCardById($stateParams.id);
  $scope.comments   = Comment.getByCardId($stateParams.id);
  $scope.newComment = {card_id: $stateParams.id, user_name: "Mr. A"}
  console.log( Card.get().length);
  
  $scope.reply = function(){
    // NOTE: We copy newComment in order to avoid resetting it after the fact.
  	Comment.add(angular.copy($scope.newComment));
    $scope.comments = Comment.getByCardId($stateParams.id);
    $scope.newComment.content = "";
  }

})
