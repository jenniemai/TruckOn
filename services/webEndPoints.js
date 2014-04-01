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

/**
 * Gets food truck by name
 */
 /*
exports.getFoodTruck = function getFoodTruck(name)
{
	dbUtilServices.getFoodTruck(name, callback);

}
*/