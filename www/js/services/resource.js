angular.module('app.services')
.factory('EducationalResource', ["$q", function($q) {
  return {
    getAll: function() {
      var dbx = new Dropbox({ accessToken: onpoint.env.dropbox_access_token});
      return $q.when(dbx.filesListFolder({path: ''}))
    },

    get: function(path) {
      var dbx = new Dropbox({ accessToken: onpoint.env.dropbox_access_token});
      return $q.when(dbx.filesListFolder({path: path}))
    },

    downloadLink: function(path) {
      var dbx = new Dropbox({ accessToken: onpoint.env.dropbox_access_token});
      // return
      return $q.when(dbx.sharingCreateSharedLink({path: path})).then(function(res) {
        console.log(res)
        return res.url
      }).catch(function(res) {
        return $q.when(dbx.sharingGetSharedLinks({path: path})).then(function(res) {
          return res.links[0].url
        })
      })
    }
  };
}])
