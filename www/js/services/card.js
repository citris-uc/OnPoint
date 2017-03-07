angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationSchedule", "MeasurementSchedule", "$firebaseArray", "$firebaseObject", "$http", "moment", function(CARD, Patient, MedicationSchedule, MeasurementSchedule, $firebaseArray, $firebaseObject, $http, moment) {
  return {
    get: function() {
      var ref = this.ref();
      return $firebaseArray(ref)
    },
    getByDay: function(date) {
      var dateISO = date.toISOString().substring(0,10);
      var ref = this.ref().child(dateISO);
      return $firebaseArray(ref);
    },
    today: function() {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "cards?upcoming=1",
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },
    history: function(end_date_string) {
      return Patient.get().then(function(p) {
        return $http({
          method: "GET",
          url:    onpoint.env.serverURL + "cards/history?end_date=" + end_date_string,
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },
    getByID: function(id) {
      return Patient.get().then(function(p) {
        date_string = moment(new Date()).format("YYYY-MM-DD")
        return $firebaseObject(Patient.ref(p.uid).child("cards").child(date_string).child(id))
      }).catch(console.log.bind(console));
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
    createAppointment: function(firebase_id, appointment) {
      return Patient.get().then(function(p) {
        return $http({
          method: "PUT",
          url:    onpoint.env.serverURL + "cards/appointment",
          data: {
            firebase_id: firebase_id,
            appointment: appointment
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      }).catch(console.log.bind(console));
    },
    destroyAppointment: function(firebase_id, appt_date) {
      console.log("DESTROYING APPOINTMENT: ")
      console.log(firebase_id)
      console.log(appt_date)
      console.log("-------")
      return Patient.get().then(function(p) {
        return $http({
          method: "DELETE",
          url:    onpoint.env.serverURL + "cards/destroy_appointment",
          params: {
            firebase_id: firebase_id,
            appointment_date: appt_date
          },
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      })
    },
    complete: function(card) {
      var ref = this.todaysRef().child(card.$id);
      var now = (new Date()).toISOString();

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
      var now = (new Date()).toISOString();

      var updateObject = {updated_at: now, archived_at: now};

      var req = ref.once('value', function(snapshot) {
        if(snapshot.exists()) {
          var card = snapshot.val();
          var cardRef = snapshot.ref();
          cardRef.update(updateObject);
        }
      })
      return req;
    },

    // TODO: This updates the existing scheduled cards.
    updateSchedCard: function(object_type, obj_id, object, date) {
      // TODO: Call Rails.
    },

    forceGenerate: function() {
      return Patient.get().then(function(p) {
        return $http({
          method: "DELETE",
          url:    onpoint.env.serverURL + "cards/force",
          headers: {
           "Authorization": "Bearer " + p.token
          }
        })
      }).catch(console.log.bind(console));
    },

    // createFromSchedSlot: function(object_type, obj_id, object, date) {
    //   // Only create if cards for the day have already been created
    //   var that = this;
    //   date_key = date.substring(0,10);
    //
    //   var cardRef = this.ref().child(date_key);
    //   cardRef.once("value", function (cardSnap) { //only do this once per day
    //     if (cardSnap.exists()) {
    //       var show = new Date(date);
    //       if (object.days[show.getDay()]) { //only generate if scheduled for this day
    //         if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
    //           show.setHours(parseInt(object.time.substring(0,2)));
    //           show.setMinutes(parseInt(object.time.substring(3,5)));
    //         } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
    //           show.setHours(object.hour);
    //           show.setMinutes(object.minute);
    //         }
    //
    //
    //         var now = new Date().toISOString();
    //         var card = {
    //           type: CARD.TYPE.ACTION,
    //           created_at: now,
    //           updated_at: now,
    //           shown_at: show.toISOString(),
    //           completed_at: null,
    //           archived_at: null,
    //           num_comments: 0,
    //           object_type: object_type,
    //           object_id: obj_id
    //         }
    //         that.create(date_key, card);
    //       } //end if(schedule.days[show.getDay()])
    //
    //     }
    //   })
    // },

    // createFromSchedule: function(ref, object_type, date) {
    //   var that = this;
    //   var now  = (new Date()).toISOString();
    //   var date_key = date.substring(0,10);
    //   ref.once("value", function(snap) {
    //     console.log(snap)
    //     snap.forEach(function(childSnap) {
    //       var schedule = childSnap.val();
    //       console.log(schedule)
    //       //TODO: update these to be minutes from midnight.
    //       var show = new Date(date);
    //       //console.log(schedule.days)
    //       //console.log(show.getDay())
    //       if (schedule.days[show.getDay()]) { //only generate if scheduled for this day
    //         if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
    //           show.setHours(parseInt(schedule.time.substring(0,2)));
    //           show.setMinutes(parseInt(schedule.time.substring(3,5)));
    //         } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
    //           show.setHours(schedule.hour);
    //           show.setMinutes(schedule.minute);
    //         }
    //
    //         var card = {
    //           type: CARD.TYPE.ACTION,
    //           created_at: now,
    //           updated_at: now,
    //           shown_at: show.toISOString(),
    //           completed_at: null,
    //           archived_at: null,
    //           num_comments: 0,
    //           object_type: object_type,
    //           object_id: childSnap.key()
    //         }
    //         that.create(date_key, card);
    //       } //end if(schedule.days[show.getDay()])
    //     })
    //   })
    // },
    //

    /*
     * @param date is in ISO format
     */
    // createFromObjectForDate: function(object_type, date) {
    //   if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
    //     var defaultRef = MedicationSchedule.ref();
    //     this.createFromSchedule(defaultRef, object_type, date);
    //   }
    //   else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
    //     var defaultRef = MeasurementSchedule.ref();
    //     this.createFromSchedule(defaultRef, object_type, date);
    //   }
    //   else if(object_type == CARD.CATEGORY.APPOINTMENTS) {
    //     this.createAppointmentCards(date, object_type);
    //   }
    //
    // },


    // This method queries "2016-04-01" on "cards" key and
    // a) if key is not found, creates Medication and Measurement schedules.
    // b) if key is found, checks if the date has Measurement/Medication schedules,
    //    and if not, then generates them.
    // generateCardsFor: function(date) {
    //   var that = this;
    //   date_key = date.substring(0,10);
    //
    //   var cardRef = this.ref().child(date_key);
    //   cardRef.once("value", function (cardSnap) { //only do this once per day
    //     if (!cardSnap.exists()) {
    //       that.createFromObjectForDate(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date)
    //       // that.createFromObjectForDate(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date)
    //       // that.createFromObjectForDate(CARD.CATEGORY.APPOINTMENTS, date)
    //     } else {
    //       // Check to make sure each has been generated
    //       // var measExists = false;
    //       var medsExists = false;
    //       // var apptExists = false;
    //       cardSnap.forEach(function(childSnap) {
    //         // if (childSnap.val().object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) measExists = true;
    //         if (childSnap.val().object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) medsExists = true;
    //         // if (childSnap.val().object_type == CARD.CATEGORY.APPOINTMENTS) apptExists = true;
    //       });
    //       if (!medsExists)
    //         that.createFromObjectForDate(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date)
    //
    //       // if (!measExists)
    //       //   that.createFromObjectForDate(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date)
    //       // if (!apptExists)
    //       //   that.createFromObjectForDate(CARD.CATEGORY.APPOINTMENTS, date);
    //     }
    //   })
    // }
    //

  }
}])
