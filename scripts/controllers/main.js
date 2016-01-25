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
      console.log($scope.username);
      githubApi.getUserRepositories($scope.username).success(function(response)
      {
        $scope.repositories=response.data;
        var namesRepoArray=getListOfRepositoryNames(response.data);
        githubApi.getUserRepositoriesActivity($scope.username, namesRepoArray).then(function(response){
          console.log(response);
        });
      });
    }
    var getListOfRepositoryNames=function(array)
    {
      var responseArray=[];
      for (var i = 0; i < array.length; i++) {
        responseArray.push(array[i].name);
      }
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
        xAxis: {
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          labels: {
              enabled: false
          },
          minorTickLength: 0,
          tickLength: 0
          },
        yAxis:{
          lineWidth: 0,
          minorGridLineWidth: 0,
          lineColor: 'transparent',
          labels: {
              enabled: false
          },
          minorTickLength: 0,
          tickLength: 0
        },
        plotOptions: {
            column: {
                depth: 40,
                stacking: false,
                grouping: false,
                groupZPadding: 20
            }
        },
        series: [{
            data: [1, 2, 4, 3, 2, 4],
            stack: 0
        }, {
            data: [5, 6, 3, 4, 1, 2],
            stack: 1
        }, {
            data: [7, 9, 8, 7, 5, 8],
            stack: 2
        },
        {
            data: [1, 2, 4, 3, 2, 4],
            stack: 3
        }, {
            data: [5, 6, 3, 4, 1, 2],
            stack: 4
        }, {
            data: [7, 9, 8, 7, 5, 8],
            stack: 5
        },{
            data: [1, 2, 4, 3, 2, 4],
            stack: 6
        }, {
            data: [5, 6, 3, 4, 1, 2],
            stack: 7
        }]
    });
  }]);
