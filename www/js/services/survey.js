angular.module('app.services')

.factory("Survey", ["$firebaseArray", "$firebaseObject", "moment", "Patient", function($firebaseArray, $firebaseObject, moment, Patient) {
  return {
    getAll: function() {
      key = moment(new Date()).format("YYYY-ww")

      return Patient.get().then(function(p) {
        return $firebaseArray(Patient.ref(p.uid).child("surveys").child(key)).$loaded()
      }).then(function(doc) {
        console.log(doc)
        return doc
      })
    },

    createIfEmpty: function() {
      thisS = this
      return this.getAll().then(function(docs) {
        if (docs && docs.length > 0)
          return docs
        return thisS.save("costars", {})
      }).then(function() {
        return thisS.save("anxiety", {})
      })
    },

    save: function(id, survey) {
      key = moment(new Date()).format("YYYY-ww")

      if (id == "anxiety")
        name = "Anxiety Questionnaire"
      else if (id == "costars") {
        name = "CoSTARS Screening Protocol"
      }

      return Patient.get().then(function(p) {
        return $firebaseObject(Patient.ref(p.uid).child("surveys").child(key).child(id)).$loaded()
      }).then(function(doc) {
        console.log("SURVEY IS: ")
        console.log(survey)
        console.log("-----")

        console.log("DOC IS: ")
        console.log(doc)
        console.log("-----")
        // Construct the answers
        if (!doc) {
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
        doc.name = name
        if (!doc.started_at && survey.start)
          doc.started_at = survey.start.toISOString()
        if (!doc.ended_at && survey.end)
          doc.ended_at   = survey.end.toISOString()
        if (!doc.completed_at && survey.start && !survey.canceled)
          doc.completed_at = (new Date()).toISOString()

        return doc.$save()
      })
    }
  }
}])
