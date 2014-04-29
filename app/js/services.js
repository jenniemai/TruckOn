'use strict';

/* Services */
var myApp = angular.module('foodTruckApp.services', []);

myApp.service('currentFoodTruck', function($http) {
    var foodtruck;
    var prevTruck;
    var infoWindow;
    var gmap;
    var daysStr = new Array();
    var reviewsArray = new Array();
    var isOpen = false;
    
    return {
        getFoodTruck: function() {
            return foodtruck;
        },
        setFoodTruck: function(value, info) {
            foodtruck = value;
            infoWindow = info.templatedInfoWindow.control.getInfoWindow();
            gmap = info.control.getGMap();
        },
        getInfoWindow: function() {
        	return infoWindow;
        },
        getSchedule: function() {

        	if (foodtruck && foodtruck != prevTruck)
        	{
        		prevTruck = foodtruck;
        		daysStr = new Array();
        		var name = foodtruck.name;
        		var description = foodtruck.description;
        		var schedule = foodtruck.schedule;

    			var prevStart, prevEnd, currStr = "";
        		var daysArray = new Array();

			    _.each(schedule, function(curr) {

			        if (!prevStart || (prevStart == curr.startTime && prevEnd == curr.endTime))
			        {  
			            daysArray.push(curr.dayOfWeek);
			            prevStart = curr.startTime;
			            prevEnd = curr.endTime;             
			        }else{
			            daysStr.push({days: daysArray.join(", "), start: prevStart, end: prevEnd});
			            daysArray = new Array();
			            daysArray.push(curr.dayOfWeek);
			            prevStart = curr.startTime;
			            prevEnd = curr.endTime;
			        }
			    });
    			if (schedule.length > 0){
                    if (daysArray.length == 7)
                        daysStr.push({days: "Everyday", start: prevStart, end: prevEnd});
                    else    
        			    daysStr.push({days: daysArray.join(", "), start: prevStart, end: prevEnd});
                }
    		}
        	return daysStr;
        },
        openInfo: function(map) {
            infoWindow.open(map);
        },
        getReviews: function(callback) {

        	if(foodtruck)
        	{
        		reviewsArray = new Array();
        	    //get reviews
                $http.get('/reviews/' + foodtruck.name).success(function (data) {
                    var reviews = data;
                    //todo: cache it
                    if (reviews && reviews.length > 0)
                    {
                    	reviewsArray = reviews;
                        infoWindow.setContent(infoWindow.getContent()); // force redraw info window canvas
                        infoWindow.open(gmap);
                        if (callback)
                            callback(reviews);
                    }
                });
            }
            return reviewsArray;
        },
        createReview: function(newReview, callback) {
            $http({
                method: 'POST',
                url: '/reviews/',
                data: newReview
            })
            .success(function (data) {
               callback();

            });
        }, 
        reviews: function() {
            return reviewsArray;
        },
        setOpenEditor: function(open) {
            isOpen = open;        
        },
        isOpenEditor: function() {
            return isOpen;
        }
    }
});


