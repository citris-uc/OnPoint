angular.module('app.services')

.factory("Survey", ["$firebaseArray", "$firebaseObject", "moment", "Patient", "$q", function($firebaseArray, $firebaseObject, moment, Patient, $q) {
  return {
    key: moment(new Date()).format("YYYY-MM-DD"),

    getAll: function() {
      thisS = this

      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("questionnaires").child("follow_ups").child(thisS.key)).$loaded()
      }).then(function(doc) {
        console.log(doc)
        return doc
      })
    },

    getSchedule: function() {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("questionnaire_schedule").once("value")
      }).then(function(doc) {
        return doc.val()
      })
    },

    updateSchedule: function(schedule) {
      return Patient.get().then(function(p) {
        return Patient.ref(p.uid).child("questionnaire_schedule").update(schedule)
      })
    },

    updateFollowUpQuestionnaires: function(survey) {
      thisS = this

      console.log("Looking at survey: ")
      console.log(survey)
      return $q.all(
        _.each(survey.childResults, function(question) {
          if (question.id == 'Vomiting')
            question.id = "Nausea"

          if (question.answer && +question.answer >= 7)
            return thisS.save(question.id, {id: question.id})
        })
      )
    },

    assignAttributes: function(id, doc, survey) {
      console.log("Assign attributes for: ")
      console.log("doc = ")
      console.log(doc)
      console.log("survey = " + JSON.stringify(survey))
      console.log("--------------------")

      if (!doc) {
        doc = {}
        for (var key in survey) {
          doc[key] = survey[key]
        }
      } else {
        for (var key in survey) {
          if (!!survey[key])
            doc[key] = survey[key]
        }
      }

      // Set specific filters ONLY IF they haven't been set yet.
      doc.name = id.replace("_", " ")
      if (!doc.started_at && survey.start)
        doc.started_at = survey.start.toISOString()
      if (!doc.ended_at && survey.end)
        doc.ended_at   = survey.end.toISOString()
      if (!doc.completed_at && survey.start && !survey.canceled)
        doc.completed_at = (new Date()).toISOString()

      // Let's update the canceled attribute if the survey wasn't canceled.
      if (!survey.canceled)
        doc.canceled = false

      return doc
    },

    saveSymptomsQuestionnaire: function(id, survey) {
      thisS = this
      key = moment(new Date()).format("YYYY-MM-DD x")

      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("questionnaires").child("Symptoms").child(key)).$loaded()
      }).then(function(doc) {
        newDoc = thisS.assignAttributes(id, doc, survey)
        return newDoc.$save()
      }).then(function(doc) {
        return thisS.updateFollowUpQuestionnaires(survey)
      })
    },

    save: function(id, survey) {
      thisS = this
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("questionnaires").child("follow_ups").child(thisS.key).child(id)).$loaded()
      }).then(function(doc) {
        doc = thisS.assignAttributes(id, doc, survey)
        return doc.$save()
      })
    },
    destroyFollowUp: function(id) {
      thisS = this
      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("questionnaires").child("follow_ups").child(thisS.key).child(id)).$remove()
      })
    }
  }
}])
