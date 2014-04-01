'use strict';

/* Controllers */
angular.module('foodTruckApp.controllers', ["google-maps"]).
controller('controller', ['$scope', '$http',
    function ($scope, $http) {

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
                        $scope.visibleTrucks = checkMarkerBounds($scope.gmarkers);
                    }

                },
                markers: {},
                control: {},
                clusterOptions: {
                    title: 'Click to expand cluster',
                    gridSize: 60,
                    ignoreHidden: true,
                    minimumClusterSize: $scope.clusterLevel
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
                                setInfoWindow(foodtruck); //TODO: the infoWindow directive had performance issues. Work-around.
                        } 
             });

            //initialize the map and visibleTrucks to the full set
            $scope.map.markers = $scope.gmarkers;
            $scope.visibleTrucks = $scope.foodTrucks;

        });

        //@param filteredMarkers - markers filtered by "filter" mechanism. There is a bug with using filters directly on the markers directive.
        $scope.map.updateMarkers = function (filteredMarkers) {
            $scope.map.markers = filteredMarkers;
            $scope.visibleTrucks = checkMarkerBounds(filteredMarkers);
        };

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

        //Work-around is to use one infoWindow instance and to manually move/open it (instead of via scope refresh)
        var infowindow = new google.maps.InfoWindow({
            size: new google.maps.Size(50, 50)
        });


        var setInfoWindow = function (foodtruck) {

            if (foodtruck && $scope.map.control && $scope.map.control.getGMap) {
                var map = $scope.map.control.getGMap();

                var content = formatSchedule(foodtruck.name, foodtruck.description, foodtruck.schedule);

                infowindow.setContent(content);
                infowindow.setPosition(new google.maps.LatLng(foodtruck.latitude, foodtruck.longitude));
                infowindow.open(map);

            }
        };


        //todo: should do in directive
        var formatSchedule = function(name, description, schedule){
            var content = name + "<br>";
            content += description + "<br>";
            var prevStart, prevEnd, currStr = "";
            var daysStr = new Array();

            _.each(schedule, function(curr) {

                if (!prevStart || (prevStart == curr.startTime && prevEnd == curr.endTime))
                {  
                    currStr += curr.dayOfWeek + ", "; 
                    prevStart = curr.startTime;
                    prevEnd = curr.endTime;             
                }else{
                    daysStr.push({days: currStr, start: prevStart, end: prevEnd});
                    currStr = "";
                    prevStart = curr.startTime;
                    prevEnd = curr.endTime;
                }
            });
             daysStr.push({days: currStr, start: prevStart, end: prevEnd});

            _.each(daysStr, function(next) {
                content += (next.days + ": " + next.start + " - " + next.end + "<br>"); 
            });
            return content;
        }
    }
]);