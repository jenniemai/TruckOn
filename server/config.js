
var IS_UPDATE_FOODTRUCK_LIST = false; 
var DB_CONNECTION = "mongodb://localhost:27017/TruckOn";
var SERVER_PORT = 3000;


exports.isUpdateFoodTruckList = function()
{
	return IS_UPDATE_FOODTRUCK_LIST;
}

exports.getDBConnection = function()
{
	return DB_CONNECTION;
}

exports.getServerPort = function()
{
	return SERVER_PORT;
}