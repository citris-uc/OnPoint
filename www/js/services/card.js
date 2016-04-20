angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationHistory", "$firebaseArray", "$firebaseObject", function(CARD, Patient, MedicationHistory, $firebaseArray, $firebaseObject) {
  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getByDay: function(date) {
      var dateISO = date.toISOString().substring(0,10)
      var ref = this.ref().child(dateISO);
      return $firebaseArray(ref);
    },
    getById: function(id) {
      var ref = this.todaysRef().child(id)
      return $firebaseObject(ref)
    },
    getHistory: function() {
      var dateISO = (new Date()).toISOString().substring(0,10)
      var ref = this.ref().orderByKey().endAt(dateISO).limitToLast(3);
      return $firebaseArray(ref);
    },
    ref: function() {
      var uid = Patient.uid();
      return Patient.ref(uid).child("cards");
    },
    todaysRef: function() {
      // TODO: No better way to get only the date from a Date object?
      var dateISO = (new Date()).toISOString().substring(0,10)  //Only get the date: YYYY-MM-DD
      return this.ref().child(dateISO);
    },

    create: function(date, card) {
      var ref = this.ref().child(date);
      ref.push(card); //use push to generate a UNIQUE card ID for each firebase card.
    },
    complete: function(card) {
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject; //use this if updating an element. see https://www.firebase.com/docs/web/api/firebase/update.html
      updateObject = {updated_at: now,
                      completed_at: now};

      //Add to or update firebase
      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) { //this date child exists
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },
    archive: function(card) {
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toTimeString();

      var updateObject = {updated_at: now, archived_at: now};

      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) {
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    }
  }
}])
