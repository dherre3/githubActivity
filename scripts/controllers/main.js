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
      githubApi.getUserRepositories($scope.username).success(function(response)
      {
        $scope.repositories=response.data;
        console.log(response.data);
        var namesRepoArray=getListOfRepositoryNames(response.data);
        $scope.repositoryNames=namesRepoArray;
        /*githubApi.getUserRepositoriesActivity($scope.username, namesRepoArray).then(function(response){
          console.log(response);
        });*/
        $timeout(function(){
            $scope.repositoryNames=JSON.parse(window.localStorage.getItem('dherre3NameRepos'));
            $scope.repositories=JSON.parse(window.localStorage.getItem('dherre3Repos'));
            $scope.repositoryActivity=JSON.parse(window.localStorage.getItem('dherre3RepoActivity'));
            for (var i = 0; i < $scope.repositoryActivity.length; i++) {
              $scope.repositoryActivity[i]=$scope.repositoryActivity[i].data.data;
            };
            //$scope.repositoryActivity=response;
            console.log($scope.repositoryNames);
            console.log($scope.repositories);
            console.log($scope.repositoryActivity);
            /*var array=prepareAllRepositories();
            graphRepository(array);*/
          })
      });
      $scope.graphAllRepositories=function()
      {
        
        cleanGraph();
        var array=filter();
        var array=prepareAllRepositories(array);
        prepareGraphRepository(array);
        var chart=$('#container').highcharts();
        chart.redraw()

      }
      function filter()
      {
        return $scope.repositoryActivity; 
      }
      function cleanGraph()
      {
        var chart=$('#container').highcharts();
        while(chart.series.length > 0)chart.series[0].remove(true);
      }
      $scope.graphRepository=function(index)
      {
        cleanGraph();
        var array=prepareIndividualRepository(index);
        prepareGraphRepository(array);
        var chart=$('#container').highcharts();
        chart.redraw()
        for (var i = 0; i < 7; i++) {
          chart.series[i].update('Monday', false);
          chart.redraw();
        };
      }
      /*$timeout(function(){
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


        var transpose=transposeArray(totalArray);
        var dateArray=transposeDateArray(totalArray);
        console.log(transpose);
        var highchartsArray=prepareSeries(transpose, dateArray);
        console.log(highchartsArray);
        var chart = $('#container').highcharts();
        //var highchartsArray=transposeArray(totalArray);
        for (var k = 0; k < highchartsArray.length-1; k++) {
          console.log(highchartsArray[k]);
            chart.addSeries({
                data: highchartsArray[k],
                stack:highchartsArray.length-1-k
            },false);
   
        };
        chart.addSeries({
                data: highchartsArray[highchartsArray.length-1].days,
                stack:0,
                name:$filter('date')(highchartsArray[highchartsArray.length-1].date,'EEE MMMM d yyyy')
        });


            
    
        $scope.repositoryActivity=$scope.repositoryActivity
      })*/

    }
    function prepareGraphRepository(totalArray)
    {      
      var transpose=transposeArray(totalArray);
      var dateArray=transposeDateArray(totalArray);
      var highchartsArray=prepareSeries(transpose, dateArray);
      console.log(highchartsArray);
      var chart = $('#container').highcharts();
      //var highchartsArray=transposeArray(totalArray);
      for (var k = 0; k < highchartsArray.length; k++) {
        console.log(highchartsArray[k]);
          chart.addSeries({
              data: highchartsArray[k],
              stack:highchartsArray.length-k
          },false);
 
      };
      chart.addSeries({
              data: highchartsArray[highchartsArray.length-1].days,
              stack:0,
              name:$filter('date')(highchartsArray[highchartsArray.length-1].date,'EEE MMMM d yyyy')
      });

    }

    function prepareAllRepositories(array)
    {
      var totalArray=initializeTotalArray(array.length);
      for (var i = 0; i < array.length; i++) {
        //$scope.repositoryActivity[i]=$scope.repositoryActivity[i].data.data;
        for (var j = 0; j < 52; j++) {
            var dateObject=new Date(array[i][j].week*1000);
            totalArray[j].date=new Date(dateObject.setDate(dateObject.getDate()+1));
            if(totalArray[j].date.getMonth()==8&&i==13)
            {
              console.log(totalArray[j]);
            }
            totalArray[j].days=addTwoArrays(totalArray[j].days,array[i][j].days);
          }
      };
      return totalArray;
    }
    function prepareIndividualRepository(repoNumber)
    {
      console.log(repoNumber);
      var totalArray=initializeTotalArray();
      totalArray=$scope.repositoryActivity[repoNumber];
      for (var v = 0; v < 52; v++) {
        var dateObject=new Date($scope.repositoryActivity[repoNumber][v].week*1000);
        $scope.repositoryActivity[repoNumber][v].date=new Date(dateObject.setDate(dateObject.getDate()+1));
      };
      return totalArray;
    }
    function OnlyforkRepos(val)
    {
      if(val)
      {

      }else{

      }
    }

    function prepareSeries(tranpose, transposeName)
    {
      
      var weeks=[];
      for (var h = 0; h < 7; h++) {
        var points=[]
        for (var i = 0; i < 52; i++) {
          var series={};
          series.y=tranpose[h][i];
          series.name=transposeName[h][i];
          if(tranpose[h][i]>20)
          {   
            series.color='#1e6823';
          }else if(tranpose[h][i]>10)
          {
            series.color='#44a340';
          }else if(tranpose[h][i]>=5)
          {
            series.color='#8cc665';
          }else if(tranpose[h][i]<5&&tranpose[h][i]>0){
            series.color='#d6e685';
          }else{
            series.color='#eee';
          }
          points.push(series);
        };
        weeks.push(points);

      };
      return weeks;
    }
    function transposeArray(array)
    {
      var dayArray=new Array(7);
      var dateArray=new Array(7);
      for (var i = 0; i < dayArray.length; i++) {
        var newArray=new Array(52);
        var newArray2=new Array(52);
        dayArray[i]=newArray;
        dateArray[i]=newArray2;

      };

      var object={};
      object.days=undefined;
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].days.length; j++) {
          dayArray[j][i]=array[i].days[j];
          var date=new Date(array[i].date).setDate(array[i].date.getDate()+j);
          dateArray[j][i]=$filter('date')(date,'EEE MMM d yyyy');
        };

      };
      return dayArray;
    }
    function transposeDateArray(array)
    {
  
      var dateArray=new Array(7);
      for (var i = 0; i < dateArray.length; i++) {
        var newArray2=new Array(52);
        dateArray[i]=newArray2;

      };

      var object={};
      object.days=undefined;
      for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].days.length; j++) {
          var date=new Date(array[i].date).setDate(array[i].date.getDate()+j);
          dateArray[j][i]=$filter('date')(date,'EEE MMM d yyyy');
        };
      };
      return dateArray;
    
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
      return array;
    }
    function addTwoArrays(a,b)
    {
      //Two arrays of same length
      var c=[];
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
    function copyRepositoriesObjectArray(array)
    {
      var names=[];
      for (var i = 0; i < array.length; i++) {
        for (var key in array[i]) {
          var object={};
          object[key]=array[i][key];
          names.push(object);
        };
        array[i]
      };
    }
    function copyArrayNames(array)
    {
      var names=[];
      for (var i = 0; i < array.length; i++) {
        names[i]=array[i];
      };
      return names;
    }

    $('#container').highcharts({
        chart: {

            type: 'column',
            margin: 100,
            options3d: {
				        enabled: true,
                alpha: 15,
                beta: 15,
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
