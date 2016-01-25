'user strict'
/**
 * @ngdoc function
 * @name canvasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canvasApp
 */
angular.module('canvasApp')
  .controller('MainCtrl', ['$scope','githubApi',function ($scope,githubApi) {
    //Enter user, look for user repositories, once repository picked get commit activity per week

    //User Public repositories per week
    console.log(githubApi);
    console.log('https://api.github.com/users/dherre3/repos');

    //User weekly activity per repository
    console.log('https://api.github.com/repos/dherre3/MUHCMobileApp/stats/commit_activity');
    $scope.getUserActivity=function()
    {
      /*githubApi.getUserRepositories($scope.username).success(function(response)
      {
        $scope.repositories=response.data;
        console.log(response.data);
        var namesRepoArray=getListOfRepositoryNames(response.data);
        githubApi.getUserRepositoriesActivity($scope.username, namesRepoArray).then(function(response){
          console.log(response);
        });
      });*/
    }
    var getListOfRepositoryNames=function(array)
    {
      var responseArray=[];
      for (var i = 0; i < array.length; i++) {
        responseArray.push(array[i].name);
      }
      console.log(responseArray);
      return responseArray;
    }

    $('#container').highcharts({
        chart: {

            type: 'column',
            margin: 100,
            options3d: {
				        enabled: true,
                alpha: 30,
                beta: 20,
                depth: 300
            }
        },
        title:{
          text:'Github Activity'
        },

        plotOptions: {
            column: {
                depth: 40,
                stacking: true,
                grouping: false,
                groupZPadding: 20
            }
        },
        series: [{
            data: [{y:1,color:'#d6e685'}, {y:2,color:'#8cc665'}, 4, 3, 2, 4],
            stack: 0
        }, {
            data: [5, 6, 3, 4, 1, 2],
            stack: 1
        }]
    });
  }]);
  //colors: ['#d6e685', '#8cc665', '#44a340','#1e6823','#eee'],
