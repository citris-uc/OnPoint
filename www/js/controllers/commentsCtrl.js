angular.module('app.controllers')

.controller('commentsCtrl', function($scope, $stateParams, Patient, Comment, Card, $ionicScrollDelegate) {
  $scope.comment  = {};

  $scope.$on('$ionicView.enter', function() {
    $scope.user     = Patient.getProfile();
    $scope.card     = Card.getById($stateParams.card_id);
    $scope.refreshComments()
  })

  $scope.refreshComments = function() {
    $scope.comments = Comment.getById($stateParams.comment_id);
    $scope.$broadcast('scroll.refreshComplete');
    $ionicScrollDelegate.scrollBottom();
  }

  $scope.trackEnterKey = function(event) {
    if (event.charCode === 13)
      $scope.reply()
  }

  $scope.belongsToPatient = function(comment) {
    return (comment.user === $scope.user.first_name + " " + $scope.user.last_name)
  }

  $scope.reply = function(){
    var name = $scope.user.first_name + " " + $scope.user.last_name
    var today = new Date().toISOString()
    if(!$scope.card.comment_id) { //no comments have been made to this card yet.
      //TODO: replace this with uid, for now just add a name for easy to display
      //TODO: will add other types of uses in future and then will lookup name by uid
      var comment_key = Comment.create($stateParams.card_id, name, $scope.comment.content, today);
      $scope.comments = Comment.getById(comment_key)
    }
    else {
      var newMessage =  {user: name, message: $scope.comment.content, timestamp: today}
      $scope.comments.$add(newMessage)
      $scope.card.num_comments++
      $scope.card.$save() //update firebase
    }

    $scope.comment.content = "";
    $ionicScrollDelegate.scrollBottom();
  }

})
