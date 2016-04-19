angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Patient, Comment, Card) {
  $scope.user = {first_name: Patient.getFirstName(), last_name: Patient.getLastName()}
  $scope.comments  = Comment.getById($stateParams.comment_id);
  $scope.newComment = {};

  $scope.card = Card.getById($stateParams.card_id)
  console.log($scope.comments)
  //console.log($stateParams)

  $scope.reply = function(){
    var name = $scope.user.first_name.$value + " " + $scope.user.last_name.$value
    var today = new Date().toISOString()
    if(typeof($scope.card.comment_id)==='undefined') { //no comments have been made to this card yet.
      //TODO: replace this with uid, for now just add a name for easy to display
      //TODO: will add other types of uses in future and then will lookup name by uid
      var comment_key = Comment.create($stateParams.card_id, name, $scope.newComment.content, today);
      $scope.comments = Comment.getById(comment_key)
    }
    else {
      var newMessage =  {user:name, message: $scope.newComment.content, timestamp: today}
      $scope.card.num_comments++
      $scope.card.$save() //update firebase
      $scope.comments.$add(newMessage)
    }
    $scope.newComment.content = "";
  }

})
