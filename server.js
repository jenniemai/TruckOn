var express = require('express');
var app = express();
var dbUtilServices = require('./services/dbUtilServices');
var webEndPoints = require('./services/webEndPoints');
var configProperties = require('./server/config');
var http = require('http');
var path = require('path');

app.use('/', express.static(__dirname + '/app/'));
app.use('/js', express.static(__dirname + '/app/js'));
app.use('/css', express.static(__dirname + '/app/css'));
app.use('/img', express.static(__dirname + '/app/img'));
app.use('/lib', express.static(__dirname + '/app/lib'));
app.use('/views', express.static(__dirname + '/views/'));

app.use(express.urlencoded());

//todo: read config file 
if(configProperties.isUpdateFoodTruckList())
{
	//call the services to update the DB
	dbUtilServices.updateFoodTrucksList();
}

app.get('/foodtrucks/all/', webEndPoints.getFoodTrucks());

var server = app.listen(configProperties.getServerPort(), function() {
    console.log('Listening on port %d', server.address().port);
});

