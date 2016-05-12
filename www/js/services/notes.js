angular.module('app.services')

.factory("Notes", ["Patient", "$firebaseArray", "$firebaseObject", function(Patient, $firebaseArray, $firebaseObject) {

  return {
    // Return an object so we can directly get a date's histories instead of iterating thru array.
    get: function(from, to) {
      var fromISO = from.toISOString().substring(0,10);
      var toISO = to.toISOString().substring(0,10);
      var ref = this.ref().orderByKey().startAt(fromISO).endAt(toISO);
      return $firebaseObject(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("notes")
    },
    add: function(note) {
      var today = ((new Date()).toISOString()).substring(0,10)
      var ref = this.ref().child(today);
      //Add new note to firebase
      var req = ref.once('value', function(snapshot) {
          var noteRef = snapshot.ref();
          var notesLogRef = noteRef.push(note); //save notesLogRef to create the card
          //Card.createAdHoc(CARD.CATEGORY.MEASUREMENT_LOGGED, measLogRef.key(), (new Date()).toISOString())
      })
      return req;
    }
  };
}])
