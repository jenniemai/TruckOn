'use strict';

/* Directives */
var myApp = angular.module('foodTruckApp.directives', ['google-maps']);

//directive: container for an InfoWindow. attrs: show, coords, templateURL, control (ref to InfoWindow) --> can do open()
myApp.directive('infoWindow', ["$templateCache", "$compile", 'currentFoodTruck', function($templateCache, $compile, currentFoodTruck) {

    var infoWindow =  new google.maps.InfoWindow({ size: new google.maps.Size(50, 50) });
    var templateUrl = 'partials/infoWindowContent.html';
    return {
    restrict: 'E',
        scope: {
      	    show:'=',
      	    coords:'=',
      	    control:'=',
      	    map:'=',
        },
        templateUrl: templateUrl,
        link: function (scope, element) {

      	    if(scope.control)
      	    scope.control.getInfoWindow = function() { return infoWindow; };

            scope.$watch('show', function(newValue, oldValue) {
                if (newValue == false){
                    infoWindow.close(); 
                }
            });

            scope.$watch('coords', function(newValue, oldValue) {
                if (newValue) {
				            var template = $templateCache.get(templateUrl);
				            if (template[0] == 200) {
          			        var compiled = $compile(template[1])(scope);
          			        infoWindow.setContent(compiled[0]);
    				            infoWindow.setPosition(new google.maps.LatLng(scope.coords.latitude, scope.coords.longitude));   
     			          }
                }
                if (scope.show)
                    infoWindow.open(scope.map.getGMap()); 
            }, true);
        }
    }
 }]);