// The name of this file is weird for grunt.
var forums = angular.module('forums',[],['$interpolateProvider',function($interpolateProvider){
    // set custom delimiters for angular templates
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}]);

forums.controller('GroupController',['$scope',function($scope){
	$scope.groups = ["we","are","doing","groups","later"];
}]);