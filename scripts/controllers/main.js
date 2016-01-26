'user strict'
/**
 * @ngdoc function
 * @name canvasApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canvasApp
 */
angular.module('canvasApp')
  .controller('MainCtrl', ['$scope','githubApi','$timeout','$filter',function ($scope,githubApi,$timeout,$filter) {
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
      $timeout(function(){
        $scope.repositoryNames=JSON.parse(window.localStorage.getItem('dherre3NameRepos'));
        $scope.repositories=JSON.parse(window.localStorage.getItem('dherre3Repos'));
        $scope.repositoryActivity=JSON.parse(window.localStorage.getItem('dherre3RepoActivity'));
        console.log($scope.repositoryNames);
        console.log($scope.repositories);
        console.log($scope.repositoryActivity);
        var totalCommits=[];
        var totalArray=initializeTotalArray($scope.repositoryActivity.length);
        for (var i = 0; i < $scope.repositoryActivity.length; i++) {
          $scope.repositoryActivity[i]=$scope.repositoryActivity[i].data.data;
          for (var j = 0; j < 52; j++) {
              totalArray[j].date=new Date($scope.repositoryActivity[i][j].week*1000);
              totalArray[j].days=addTwoArrays(totalArray[j].days,$scope.repositoryActivity[i][j].days);
            }
        };
        var tranpose=transposeArray(totalArray);
        console.log(tranpose);
        var chart = $('#container').highcharts();
        //var highchartsArray=transposeArray(totalArray);
        for (var k = 0; k < tranpose.length-1; k++) {
            chart.addSeries({
                data: tranpose[k],
                stack:tranpose.length-1-k
            },false);
   
        };
        chart.addSeries({
                data: totalArray[tranpose.length-1].days,
                stack:0,
                name:$filter('date')(totalArray[tranpose.length-1].date,'EEE MMMM d')
            })
            
    
        $scope.repositoryActivity=$scope.repositoryActivity
      })




    }
    function transposeArray(array)
    {
      var dayArray=new Array(7);
      for (var i = 0; i < dayArray.length; i++) {
        var newArray=new Array(53);
        dayArray[i]=newArray;
      };

      var object={};
      object.days=undefined;
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].days.length; j++) {
          dayArray[j][i]=array[i].days[j];
        };
      };
      return dayArray;
    }
    function initializeTotalArray()
    {
      var array=[];
        for (var j = 0; j < 52; j++) {
          var days=[0,0,0,0,0,0,0];
          var date=new Date();
          var object={};
          object.days=days;
          object.date=date;
          array.push(object);
        };
      console.log(array);
      return array;
    }
    function addTwoArrays(a,b)
    {
      //Two arrays of same length
      var c=[];c
      for (var i = 0; i < a.length; i++) {
        c[i]=a[i]+b[i];
      };
      return c;
    }
    //Contributions made up of opening an issue, number of commits, proposing a pull request.
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
                alpha: 20,
                beta: 20,
                depth: 400
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
        }
    });
  }]);
  //colors: ['#d6e685', '#8cc665', '#44a340','#1e6823','#eee'],
