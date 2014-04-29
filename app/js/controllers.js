'use strict';

/* Controllers */
var myApp = angular.module('foodTruckApp.controllers', ["google-maps"]);

myApp.controller('controller', ['$scope', '$http', '$filter', 'currentFoodTruck',
    function ($scope, $http, $filter, currentFoodTruck) {

        $scope.clusterLevel = 3;

        /* representation of the Map */
        $scope.map = function createMapModel() {
            var mapModel = {
                center: {
                    latitude: 37.763468,
                    longitude: -122.416314
                },
                zoom: 13,
                doCluster: true,
                draggable: true,
                bounds: {},
                events: {
                    //when the map bounds change, update the visible list of trucks
                    bounds_changed: function () {
                        $scope.visibleTrucks = checkMarkerBounds($scope.map.markers);
                    }

                },
                markers: {},
                control: {},
                clusterOptions: {
                    title: 'Click to expand cluster',
                    gridSize: 60,
                    ignoreHidden: true,
                    minimumClusterSize: $scope.clusterLevel
                },
                templatedInfoWindow: {
                    coords: {
                        latitude: 37.763468,
                        longitude: -122.416314
                    },
                    options: {
                        disableAutoPan: true
                    },
                    show: false,
                    templateUrl: 'partials/infoWindowContent.html',
                    templateParameter: {
                        message: 'passed in from the opener'
                    },
                    control: {}

                }
            }
            return mapModel;
        }();

        /* WS to get data */
        $http.get('/foodtrucks/all/').success(function (data) {


            //denormalize the data. Angular repeaters don't support nests. todo: Directive is an option but filters may not work. 
            $scope.foodTrucks = function(foodtrucks)
            {
                 var trucks = new Array();
                _.each(foodtrucks, function(truck)
                {
                    _.each(truck.locations, function(location)
                        {
                            var truckAtLocation =  jQuery.extend({schedule: location.schedule, latitude: location.latitude, longitude: location.longitude, 
                                                                   address: location.address}, truck);

                            trucks.push(truckAtLocation);
                        });
                     delete truck.locations;
                });
                return trucks;
            }(data);

            //maintain the master list of markers for restoring/resetting views
            $scope.gmarkers = function (foodtrucks) 
            {
                var i, markers = new Array();

                for (i = 0; i < foodtrucks.length; ++i) 
                {
                    var foodtruck = foodtrucks[i];
                    
                    var marker = {
                        title: foodtruck.name,
                        latitude: foodtruck.latitude,
                        longitude: foodtruck.longitude,
                        showWindow: false,
                        foodtruckId: i,
                        icon: '../img/icon-truck.png',
                        latlng: new google.maps.LatLng(foodtruck.latitude, foodtruck.longitude),
                    };
                    markers.push(marker);
                }
                return markers;
            }($scope.foodTrucks);

            _.each($scope.gmarkers, function(marker) { 
                marker.onClick = function () {
                    var foodtruck = $scope.foodTrucks[marker.foodtruckId];
                    setInfoWindow(foodtruck, true); 
                } 
            });

            //initialize the map and visibleTrucks to the full set
            $scope.map.markers = $scope.gmarkers;
            $scope.visibleTrucks = $scope.foodTrucks;

        });

        $scope.$watch("query", function(query){       
            if (!$scope.gmarkers || !query || query.length <= 1){
                return;
            }
            $scope.map.templatedInfoWindow.show = false;
            var filtered = $filter("filter")($scope.gmarkers, query );
            $scope.visibleTrucks = checkMarkerBounds(filtered); 
            $scope.map.markers = filtered;
        });


        //@param foodtruck - foodtruck model used to set the info window
        $scope.updateMarker = function (foodtruck) {
            setInfoWindow(foodtruck);
        };

        var checkMarkerBounds = function(markers)
        {
            if ($scope.map.control && $scope.map.control.getGMap)
            {
                var map = $scope.map.control.getGMap();
                var newList = new Array();
                _.each(markers, function(marker){

                    if (map.getBounds().contains(marker.latlng)) {
                        newList.push($scope.foodTrucks[marker.foodtruckId]); 
                    }      
                });
                return newList;
            }
        }

        var setInfoWindow = function (foodtruck, manuallyUpdateScope) {

            if (foodtruck && $scope.map.control && $scope.map.control.getGMap) {

                if( currentFoodTruck.getFoodTruck() == foodtruck) {
                    currentFoodTruck.openInfo($scope.map.control.getGMap());
                }
                else {
                    currentFoodTruck.setFoodTruck(foodtruck, $scope.map);
                    $scope.map.templatedInfoWindow.show = true;
                    $scope.map.templatedInfoWindow.coords = {latitude: foodtruck.latitude, longitude: foodtruck.longitude};
                    if(manuallyUpdateScope)
                        $scope.$apply();
                }
            }
        };
    }
]);

myApp.controller('infoController', ['$scope', '$http', 'currentFoodTruck',
    function InfoController($scope, $http, currentFoodTruck) {
   
        if (currentFoodTruck.getFoodTruck())
        {
            $scope.name = currentFoodTruck.getFoodTruck().name;
            $scope.description = currentFoodTruck.getFoodTruck().description;
            $scope.schedules = currentFoodTruck.getSchedule();
            currentFoodTruck.getReviews(); //get from server
        }

        $scope.getReviews = function() {
            return currentFoodTruck.reviews(); //cached reviews
        }

        $scope.openEditor = function() {
            currentFoodTruck.setOpenEditor(true);
        };

    }]);

myApp.controller('newReviewController', ['$scope', '$http', 'currentFoodTruck',
    function InfoController($scope, $http, currentFoodTruck) {
        $scope.newReview;
        $scope.closeEditor = function() {
            if ($scope.newReview)
                currentFoodTruck.getReviews();//update reviews from server
            currentFoodTruck.setOpenEditor(false);
            delete $scope.newReview;
        };

        $scope.showEditor = function() {
            if (currentFoodTruck.getFoodTruck())
                $scope.name = currentFoodTruck.getFoodTruck().name; //update current name when show
            return currentFoodTruck.isOpenEditor();
        };

        $scope.submitReview = function() {
            if ($scope.newReview && $scope.user)
            {
                var newReview = { name: $scope.user, review: $scope.newReview , truck: $scope.name};
                currentFoodTruck.createReview(newReview, $scope.closeEditor);
            }
        };

    }]);