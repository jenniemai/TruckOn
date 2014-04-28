'use strict';


// Declare app level module which depends on filters, and services
angular.module('foodTruckApp', [
  'ngRoute',
  'foodTruckApp.services',
  'foodTruckApp.directives',
  'foodTruckApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/map', {templateUrl: '../partials/map.html'});
  $routeProvider.when('/list/', {templateUrl: '../partials/list.html', controller: 'controller'});
  $routeProvider.otherwise({redirectTo: '/map'});
}]);
