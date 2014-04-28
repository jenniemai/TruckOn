var http = require('http');
var dbUtilServices = require('./dbUtilServices');


/**
 * Gets all the food trucks 
 */
exports.getFoodTrucks = function getFoodTrucks()
{
	return function(req, res)
	{
		//write the result to the response when done
		var writeToResponse = function(err, result) {
        	if (err) { 
        		throw err;
        	}
        	res.json(result);
    	}
		dbUtilServices.getFoodTrucks(writeToResponse);
	}
}

exports.getReviews = function getReviews()
{
	return function(req, res)
	{
		var name = req.params.truck;

		console.log("Name:" + req.params.truck);
		//write the result to the response when done
		var writeToResponse = function(err, result) {
        	if (err) { 
        		throw err;
        	}
        	res.json(result);
    	}
    	dbUtilServices.getReviews(name, writeToResponse);
	}
}

exports.addReview = function addReview()
{
	return function(req, res)
	{
  		var name = req.body.name,
        comment= req.body.review;
        var foodtruck = req.body.truck;

        var writeToResponse = function(err, result) {
        	if (err) { 
        		throw err;
        	}
        	res.json(result);
    	}

    	var newReview = { user:name, review: comment, truck: foodtruck};

        dbUtilServices.addReview(newReview, writeToResponse);

	}
}

/**
 * Gets food truck by name
 */
 /*
exports.getFoodTruck = function getFoodTruck(name)
{
	dbUtilServices.getFoodTruck(name, callback);

}
*/