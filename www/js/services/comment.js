angular.module('app.services')

.factory("Comment", ["Patient","$firebaseArray", function(Patient, $firebaseArray) {

  return {
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("cards");
    },
    get_comments: function(time,type,id){
      return $firebaseArray(this.ref().child(time).child(type).child(id).child("comments"));
    },
    add: function(comment,time,type,id) {
      comment.created_at = (new Date()).toISOString()
      var comments = this.get_comments(time,type,id);
      if (comments.length == 0){
  //      console.log(this.ref().child(time).child(type).child(id));
  //      this.ref().child(time).child(type).child(id).push({'comments', comment});
      }else{
        comments.push(comment);
      }
    },
    getCard: function(time,type,id) {

      return this.ref().child(time).child(type).child(id);
    }
  };
}])
