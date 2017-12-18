'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
	'ngRoute',
	'myApp.main',
	'myApp.version'
	])
.
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	$locationProvider.hashPrefix('!');

	$routeProvider.when('/main', {
		templateUrl: 'Main/MainPage.html',
		controller: 'MainPageController'
	});

	$routeProvider.otherwise({redirectTo: '/main'});
}])
