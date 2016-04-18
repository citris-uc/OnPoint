angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Comment, Patient) {

  $scope.card = Comment.getCard($stateParams.date.substring(0,10),$stateParams.type,$stateParams.id );
  $scope.comments = Comment.get_comments($stateParams.date.substring(0,10),$stateParams.type,$stateParams.id );
  $scope.user_name = Patient.get_name();
  $scope.newComment = {user_name: $scope.user_name};

  $scope.reply = function(){
    // NOTE: We copy newComment in order to avoid resetting it after the fact.
  	Comment.add(angular.copy($scope.newComment),$stateParams.date.substring(0,10),$stateParams.type,$stateParams.id);
    $scope.newComment.content = "";
  }

})
