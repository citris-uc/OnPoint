angular.module('app.services')

.factory('Comment', function() {
  comments = [
    {card_id: "2", created_at: "2016-03-15T12:00:00", user_name: "Son", content: "I will pick you up tomorrow at 10 AM mom."},
    {card_id: "2", created_at: "2016-03-15T12:30:00", user_name: "Mr.A", content: "Thanks, see you tomorrow."},
    {card_id: "2", created_at: "2016-03-15T12:33:00", user_name: "Daughter", content: "Don't forget to bring your ID."},
    {card_id: "1", created_at: "2016-03-15T13:00:00", user_name: "Son", content: "Mom, how do you feel? Are you okay now? Do I need to call nurse?"},
    {card_id: "1", created_at: "2016-03-15T13:30:00", user_name: "Mr.A", content: "I will take my measurement one hour later and let you know."},
    {card_id: "0", created_at: "2016-03-15T20:00:00", user_name: "Son", content: "Wy did you skipped Lasix today ?"},
    {card_id: "0", created_at: "2016-03-15T20:30:00", user_name: "Mr.A", content: "Lasix makes me pee a lot. I can't sleep well."},
  ]

  return {
    get: function() {
      return comments;
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
    }
  };
})
