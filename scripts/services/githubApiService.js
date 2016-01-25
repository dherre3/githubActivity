var myApp=angular.module('canvasApp');
myApp.service('githubApi',['$http','$q',function($http,$q){
  var runUserRequest=function(username)
  {
    return $http({method:'JSONP',url:'https://api.github.com/users/'+username+'/repos?callback=JSON_CALLBACK' });
  };
  var runRepoActivityRequest=function(username,repoName)
  {
    return $http({method:'JSONP',url:'https://api.github.com/repos/'+username+'/'+repoName+'/stats/commit_activity?callback=JSON_CALLBACK' });
  }
  return{
    getUserRepositories:function(username)
    {
      return runUserRequest(username);
    },
    getUserRepositoriesActivity:function(username, repoNames)
    {
      var promises=[];
      for (var i = 0; i < repoNames.length; i++) {
        promises.push(runRepoActivityRequest(username,repoNames[i]));
      }
      return $q.all(promises);
    }
  }



  }]);
