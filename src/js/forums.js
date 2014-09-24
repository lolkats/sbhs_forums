// The name of this file is weird for grunt.
var app = angular.module('app',[],['$interpolateProvider',function($interpolateProvider){
    // set custom delimiters for angular templates
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
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

app.controller('GroupController',['$scope',function($scope){
	$scope.groups = ["we","are","doing","groups","later"];
}]);

app.controller('ThreadController',['$scope',function($scope){
	$scope.x="Test";
}]);

app.controller('NotFoundController',['$scope',function($scope){
	$scope.test="Test";
}]);