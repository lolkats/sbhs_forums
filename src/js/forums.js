var siteName = "SBHS Forums | ";
var app = angular.module('app',['ngRoute'],['$interpolateProvider','$locationProvider','$routeProvider',function($interpolateProvider,$locationProvider,$routeProvider){
    // set custom delimiters for angular templates
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/',{
            templateUrl:'partials/index.html',
            controller:'HomeController'
        })
        .when('/404',{
            templateUrl:'partials/404.html',
            controller:'NotFoundController'
        })
        .when('/group/:name',{
            templateUrl:'partials/group.html',
            controller:'GroupController'
        })
        .when('/group/:gname/thread/:thread',{
            templateUrl:'partials/thread.html',
            controller:"ThreadController"
        })
        .otherwise({redirectTo:'/404'});

}]);

app.service('sharedProperties', function () {
    var hashtable = {};
    return {
        setValue: function (key, value) {
            hashtable[key] = value;
        },
        getValue: function (key) {
            return hashtable[key];
        }
    }
});

app.controller('GroupLoaderController',['$scope','$http','sharedProperties',function($scope,$http,sharedProperties){
    $scope.groups=[{name:"Loading",shortName:"#"}];
    $scope.loadGroups = function(){
        $http.get('/api/forums/groups').success(function(data){
            $scope.groups = data;
        }).error(function(){
            console.log("Failed to load groups.");
        });
    };
    if(window.authenticated){
    }
    else{
        $scope.groups=[{name:"Please Login",shortName:"#"}];
    }
}]);

app.controller('HomeController',['$scope','$window',function($scope,$window){
    $window.document.title = siteName+"Home";
}]);

app.controller('GroupController',['$scope','$routeParams','$http','$window',function($scope,$routeParams,$http,$window){
    $http.get('/api/forums/group/'+$routeParams.name).success(function(data){
        $scope.groupName=data.name;
        $scope.shortName=data.shortName;
        $window.document.title = siteName+"Group - "+data.name;
    }).error(function(){
        console.log("Failed to load group.");
    });
    $scope.loadThreads = function(){
        $http.get('/api/forums/group/'+$routeParams.name+"/threads").success(function(data){
            $scope.threads = data;
        }).error(function(){
        console.log("Failed to load group.");
        });
    };
    $scope.loadThreads();
}]);
app.controller('ThreadController',['$scope','$routeParams','$http',function($scope,$routeParams,$http){
	$scope.getPosts = function(){
        $http.get('/api/forums/thread/'+$routeParams.thread+"/posts").success(function(data){
            $scope.posts = data;
        }).error(function(){
            console.log("Failed to load posts.");
        });
    };
    $scope.loadThread = function(){
        $http.get('/api/forums/thread/'+$routeParams.thread).success(function(data){
            $scope.thread = data;
        }).error(function(){
            console.log("Failed to load posts.");
        });
    };
    $scope.loadThread();
    $scope.getPosts();
}]);

app.controller('NotFoundController',['$scope','$window',function($scope,$window){
	$window.document.title = siteName+"404";
}]);