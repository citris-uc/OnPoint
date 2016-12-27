angular.module('app.services')

.factory("Notes", ["Patient", "Card","CARD","$firebaseArray", "$firebaseObject", function(Patient,Card,CARD, $firebaseArray, $firebaseObject) {

  return {
    get: function(from, to) {
      var fromISO = from.toISOString().substring(0,10);
      var toISO = to.toISOString().substring(0,10);
      var ref = this.ref().orderByKey().startAt(fromISO).endAt(toISO);
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("notes")
    },
    add: function(note) {
      var today = ((new Date()).toISOString()).substring(0,10)
      var ref = this.ref().child(today);
      note['timestamp'] = new Date().toISOString();
      console.log(note)
      //Add new note to firebase
      var req = ref.once('value', function(snapshot) {
          var noteRef = snapshot.ref();
          var notesLogRef = noteRef.push(note); //save notesLogRef to create the card
          Card.createAdHoc(CARD.CATEGORY.NOTES, notesLogRef.key(), (new Date()).toISOString())
      })
      return req;
    }
  };
}])
