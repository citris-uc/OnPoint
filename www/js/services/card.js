angular.module('app.services')

.factory("Card", ["CARD", "Patient", "MedicationSchedule", "MeasurementSchedule", "Appointment","$firebaseArray", "$firebaseObject", function(CARD, Patient, MedicationSchedule, MeasurementSchedule, Appointment,$firebaseArray, $firebaseObject) {
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
    //Returns cards for date-1, date, and date+1
    getRangeByDate: function(date) {
      var dateISO = date.toISOString().substring(0,10);

      var yesterday = new Date();
      yesterday.setDate(date.getDate()-1);
      var yesterdayISO = yesterday.toISOString().substring(0,10);

      var tomorrow = new Date();
      tomorrow.setDate(date.getDate()+1);
      var tomorrowISO = tomorrow.toISOString().substring(0,10);
      var ref = this.ref().orderByKey().startAt(yesterdayISO).endAt(tomorrowISO);
      return $firebaseArray(ref);
    },
    getById: function(id) {
      var ref = this.todaysRef().child(id)
      return $firebaseObject(ref)
    },
    getHistory: function() {
      var today = new Date();
      var yesterday = new Date();
      yesterday.setDate(today.getDate()-1);
      var dateISO = (yesterday).toISOString().substring(0,10)
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
    updateSchedCard: function(object_type, obj_id, object, date) {
      // Only create if cards for the day have already been created
      var that = this;
      date_key = date.substring(0,10);

      var cardRef = this.ref().child(date_key);
      cardRef.once("value", function (cardSnap) { //only do this once per day
        if (cardSnap.exists()) {
          cardSnap.forEach( function(cardRef) {
            card = cardRef.val();
            // Find the Card corresponding to the schedule
            if (card.object_id == obj_id && card.object_type == object_type) {
              var show = new Date(date);
              if (object.days[show.getDay()]) { //only generate if scheduled for this day
                if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
                  show.setHours(parseInt(object.time.substring(0,2)));
                  show.setMinutes(parseInt(object.time.substring(3,5)));
                } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
                  show.setHours(object.hour);
                  show.setMinutes(object.minute);
                }

                var now = new Date().toISOString();
                var cardUpdate = {
                  shown_at: show.toISOString(),
                }
                cardRef.ref().update(cardUpdate);

              } //end if(schedule.days[show.getDay()])
            }
          })
        }
      })
    },

    createAdHoc: function(object_type, obj_id, date) {
      date_key = date.substring(0,10);
      var now = new Date().toISOString();
      var card = {
        type: CARD.TYPE.INFO,
        created_at: now,
        updated_at: now,
        shown_at: now,
        completed_at: now,
        archived_at: now,
        num_comments: 0,
        object_type: object_type,
        object_id: obj_id
      };
      this.create(date_key, card);
    },

    createFromSchedSlot: function(object_type, obj_id, object, date) {
      // Only create if cards for the day have already been created
      var that = this;
      date_key = date.substring(0,10);

      var cardRef = this.ref().child(date_key);
      cardRef.once("value", function (cardSnap) { //only do this once per day
        if (cardSnap.exists()) {
          var show = new Date(date);
          if (object.days[show.getDay()]) { //only generate if scheduled for this day
            if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
              show.setHours(parseInt(object.time.substring(0,2)));
              show.setMinutes(parseInt(object.time.substring(3,5)));
            } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
              show.setHours(object.hour);
              show.setMinutes(object.minute);
            }


            var now = new Date().toISOString();
            var card = {
              type: CARD.TYPE.ACTION,
              created_at: now,
              updated_at: now,
              shown_at: show.toISOString(),
              completed_at: null,
              archived_at: null,
              num_comments: 0,
              object_type: object_type,
              object_id: obj_id
            }
            that.create(date_key, card);
          } //end if(schedule.days[show.getDay()])

        }
      })
    },

    /*
     * @param date is in ISO format
     */
    createAppointmentCards: function(date, object_type) {
      var that = this;
      var now  = (new Date()).toISOString();
      var date_key = date.substring(0,10);

      var d = new Date(date); //date in JS Date format
      var toDate = new Date(date);
      toDate.setDate(d.getDate()+CARD.TIMESPAN.DAYS_BEFORE_APPT);
      var ref = Appointment.getAppointmentsFromToRef(d, toDate);
      //var ref = Appointment.ref();
      ref.once("value", function(snap) {
        snap.forEach(function(childSnap) { //for each date
          childSnap.forEach(function(apptSnap) {
            var appt = apptSnap.val();
            var show = new Date(date);

            //TODO: When should the reminder cards show up?
            show.setHours(CARD.REMINDER_TIME.HOUR);
            show.setMinutes(CARD.REMINDER_TIME.MINUTE);

            var card = {
              type: CARD.TYPE.REMINDER,
              created_at: now,
              updated_at: now,
              shown_at: show.toISOString(),
              completed_at: null,
              archived_at: null,
              num_comments: 0,
              object_type: object_type,
              object_id: apptSnap.key()
            }
            that.create(date_key, card);
          })
        })
      });

    },
    createFromSchedule: function(ref, object_type, date) {
      var that = this;
      var now  = (new Date()).toISOString();
      var date_key = date.substring(0,10);
      ref.once("value", function(snap) {
        snap.forEach(function(childSnap) {
          var schedule = childSnap.val();
          //TODO: update these to be minutes from midnight.
          var show = new Date(date);
          //console.log(schedule.days)
          //console.log(show.getDay())
          if (schedule.days[show.getDay()]) { //only generate if scheduled for this day
            if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
              show.setHours(parseInt(schedule.time.substring(0,2)));
              show.setMinutes(parseInt(schedule.time.substring(3,5)));
            } else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
              show.setHours(schedule.hour);
              show.setMinutes(schedule.minute);
            }

            var card = {
              type: CARD.TYPE.ACTION,
              created_at: now,
              updated_at: now,
              shown_at: show.toISOString(),
              completed_at: null,
              archived_at: null,
              num_comments: 0,
              object_type: object_type,
              object_id: childSnap.key()
            }
            that.create(date_key, card);
          } //end if(schedule.days[show.getDay()])
        })
      })
    },


    /*
     * @param date is in ISO format
     */
    createFromObjectForDate: function(object_type, date) {
      if (object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) {
        var defaultRef = MedicationSchedule.ref().child("default");
        this.createFromSchedule(defaultRef, object_type, date);
      }
      else if (object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) {
        var defaultRef = MeasurementSchedule.ref();
        this.createFromSchedule(defaultRef, object_type, date);
      }
      else if(object_type == CARD.CATEGORY.APPOINTMENTS) {
        this.createAppointmentCards(date, object_type);
      }

    },


    // This method queries "2016-04-01" on "cards" key and
    // a) if key is not found, creates Medication and Measurement schedules.
    // b) if key is found, checks if the date has Measurement/Medication schedules,
    //    and if not, then generates them.
    generateCardsFor: function(date) {
      var that = this;
      date_key = date.substring(0,10);

      var cardRef = this.ref().child(date_key);
      cardRef.once("value", function (cardSnap) { //only do this once per day
        if (!cardSnap.exists()) {
          that.createFromObjectForDate(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date)
          that.createFromObjectForDate(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date)
          that.createFromObjectForDate(CARD.CATEGORY.APPOINTMENTS, date)
        } else {
          // Check to make sure each has been generated
          var measExists = false;
          var medsExists = false;
          var apptExists = false;
          cardSnap.forEach(function(childSnap) {
            if (childSnap.val().object_type == CARD.CATEGORY.MEASUREMENTS_SCHEDULE) measExists = true;
            if (childSnap.val().object_type == CARD.CATEGORY.MEDICATIONS_SCHEDULE) medsExists = true;
            if (childSnap.val().object_type == CARD.CATEGORY.APPOINTMENTS) apptExists = true;
          });
          if (!medsExists)
            that.createFromObjectForDate(CARD.CATEGORY.MEDICATIONS_SCHEDULE, date)

          if (!measExists)
            that.createFromObjectForDate(CARD.CATEGORY.MEASUREMENTS_SCHEDULE, date)
          if (!apptExists)
            that.createFromObjectForDate(CARD.CATEGORY.APPOINTMENTS, date);
        }
      })
    }
  }
}])
