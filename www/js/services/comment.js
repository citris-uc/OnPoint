angular.module('app.services')

.factory('Comment',["Patient", "Card", "$firebaseArray", function(Patient, Card, $firebaseArray) {
  return {
    get: function() {
      return comments;
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("comments");
    },
    create: function(card, userParam, msg, date) {
      var comment = {card_id: card}; //create the new comment object
      var ref = this.ref().push(comment); //push it to firebase
      var comment_key = ref.key(); //get the comment_key
      this.ref().child(comment_key).child('messages').push({user:userParam, message:msg, timestamp: date})
      Card.todaysRef().child(card).update({"comment_id": comment_key, "num_comments": 1}) //add comment_id to card
      return comment_key
    },
    getById: function(id) {
      //console.log(id)
      if(id == "") {
        return null
      }
      //console.log("return the comments")
      var ref = this.ref().child(id).child('messages');
      return $firebaseArray(ref);
    },


    get_comments_count_by_id: function(id){
      counts = 0;
      for (var i = 0; i < comments.length; i++) {
        if (comments[i].card_id == id){
          counts = counts + 1 ;
        }
      }
      return counts;
    }
  };
}])
