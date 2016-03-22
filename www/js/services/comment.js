angular.module('app.services')

.factory('Comment', function() {
  comments = [
    {cardId: "2", timestamp: "2016-03-15T12:00:00", user_name: "Son", content: "I will pick you up tomorrow at 10 AM mom."},
    {cardId: "2", timestamp: "2016-03-15T12:30:00", user_name: "Mr.A", content: "Thanks, see you tomorrow."},
    {cardId: "2", timestamp: "2016-03-15T12:33:00", user_name: "Daughter", content: "Don't forget to bring your ID."},
    {cardId: "1", timestamp: "2016-03-15T13:00:00", user_name: "Son", content: "Mom, how do you feel? Are you okay now? Do I need to call nurse?"},
    {cardId: "1", timestamp: "2016-03-15T13:30:00", user_name: "Mr.A", content: "I will take my measurement one hour later and let you know."},
    {cardId: "0", timestamp: "2016-03-15T20:00:00", user_name: "Son", content: "Wy did you skipped Lasix today ?"},
    {cardId: "0", timestamp: "2016-03-15T20:30:00", user_name: "Mr.A", content: "Lasix makes me pee a lot. I can't sleep well."},
  ]

  return {
    get: function() {
      return comments;
    },
    getByCardId: function(id) {
      comments = [];
      for (var i = 0; i < comments.length; i++) {
        if (comments[i].cardId == id){
          comments.push(comments[i]);
        }
      }
      return comments;
    },
  };
})
