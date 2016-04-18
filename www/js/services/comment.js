angular.module('app.services')

.factory('Comment',["Patient", "Card", "$firebaseArray", function(Patient, Card, $firebaseArray) {
  comments = [
    {card_id: "6", created_at: "2016-03-15T12:00:00", user_name: "Son", content: "I will pick you up tomorrow at 10 AM mom."},
    {card_id: "6", created_at: "2016-03-15T12:30:00", user_name: "Mr.A", content: "Thanks, see you tomorrow."},
    {card_id: "6", created_at: "2016-03-15T12:33:00", user_name: "Daughter", content: "Don't forget to bring your ID."},
    {card_id: "1", created_at: "2016-03-15T13:00:00", user_name: "Son", content: "Mom, how do you feel? Are you okay now? Do I need to call nurse?"},
    {card_id: "1", created_at: "2016-03-15T13:30:00", user_name: "Mr.A", content: "I will take my measurement one hour later and let you know."},
    {card_id: "0", created_at: "2016-03-15T20:00:00", user_name: "Son", content: "Wy did you skipped Lasix today ?"},
    {card_id: "0", created_at: "2016-03-15T20:30:00", user_name: "Mr.A", content: "Lasix makes me pee a lot. I can't sleep well."},
  ]

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
      Card.todaysRef().child(card).update({"comment_id": comment_key}) //add comment_id to card
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
    getByCardId: function(id) {
      cardcomments = [];
      for (var i = 0; i < comments.length; i++) {
        if (comments[i].card_id == id){
          cardcomments.push(comments[i]);
        }
      }
      return cardcomments;
    },
    add: function(comment) {
      comment.created_at = (new Date()).toISOString()
      comments.push(comment);
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
