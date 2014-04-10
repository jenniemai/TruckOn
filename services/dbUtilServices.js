var http = require("http");
var models = require("../models/models");
var mongo = require('mongoskin');
var configProperties = require('../server/config');
var db = mongo.db(configProperties.getDBConnection(), {native_parser:true});

/**
 * @param callback to process the resulting food truck list
 */
exports.getFoodTrucks = function(callback)
{

      var collection = getFoodTruckCollection();
      collection.find().toArray(callback);

}

/**
 *  Will update the DB with the JSON data files. Note that there is a JSON API that can be used, 
 *  sadly, it is only a subset of the data and it unreliable. Ideally, this data would be regularly 
 *  downloaded from  DataSF and then this function can be put into a cron. 
 */
exports.updateFoodTrucksList = function()
{

  updateFoodTrucksFromPermitList(updateFoodTrucksSchedule);

}

/**
 * Gets the data from the permits list, the callback will then further update the list with
 * schedule info 
 */
function updateFoodTrucksFromPermitList(callback)
{
        
          var json = __dirname + "/../server/data/foodTruckPermits.json";

          var fs = require('fs');
          var file = json;
          var results = '';
          fs.readFile(file, 'utf8', function (err, data) {
                if (err) {
                  console.log('Error: ' + err);
                  return;
                }
                results = JSON.parse(data);

                console.log(results.length);

               var trucksMeta = processPermitResults(results);
               console.log(trucksMeta);

               callback(trucksMeta);

          });
}

function processPermitResults(results)
{
    var foodtrucks = new Array();
    var i, foodtruckArrIdx = 0; 
    var hasher = new Hasher();

    for (i = 0; i < results.length; ++i)
    {
        var rawtruck = results[i];
        //create new location for this truck name  
        var location = models.createLocationSchedule(rawtruck.address, rawtruck.locationdescription, 
          rawtruck.latitude, rawtruck.longitude); 
   
        var name = rawtruck.applicant;
        //first time encountering truck - put it in the hash and add it to the result list
        if (!hasher.getHash(name))
        {
          hasher.createHash(name, foodtruckArrIdx, location.address);
          foodtruckArrIdx++;

          //create new locations array
          var locations = new Array();
          locations.push(location);
          
          //create a new foodtruck model -- name, approved, permit, locations, description)
          var foodtruck = models.createFoodTruck(rawtruck.applicant, rawtruck.approved, rawtruck.permit, 
            locations, rawtruck.fooditems, rawtruck.facilitytype);
          foodtrucks.push(foodtruck);

        }
        //truck already exists - update it only if the location address is not seen yet (remove dupe)
        else{

            if (!hasher.getLocation(name, location.address))
            {
              hasher.updateLocation(name, location.address);
              var idx = hasher.getIndex(name);
              var ft = foodtrucks[idx]; //get truck based on index stored by hash
              ft.locations.push(location); // add newly created location
        
           }
        } 
    }

    var retVal = new Object();
    retVal.foodtrucks = foodtrucks;
    retVal.truckHash = hasher;
    return retVal;

}

/**
 * Update the "locations" property of the foodtruck object models to have time info for each location
 */ 
function updateFoodTrucksSchedule(trucksMeta)
{

   var json = __dirname + "/../server/data/foodTruckSchedules.json";

  var fs = require('fs');
  var file = json;
  var results = '';
  fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
          console.log('Error: ' + err);
          return;
        }
        results = JSON.parse(data);

        foodtrucks = processSchedules(results, trucksMeta);

       console.log(foodtrucks.length);

      addFoodTruckstoStore(foodtrucks);

  });
}

function processSchedules(results, trucksMeta)
{

  var truckHash = trucksMeta.truckHash;
  var foodtrucks = trucksMeta.foodtrucks;

    results.forEach(function(schedule) 
    {
       //get the foodtruck associated with this schedule. 
       var name = schedule.Applicant;
       var address = schedule.PermitLocation;

       //food truck match found - update
       if (truckHash.getHash(name))
       {
          var index = truckHash.getIndex(name);
          var truck = foodtrucks[index];

          truck.locations.forEach(function(location)
          {
            if(location.address === address)
            {
                location.update(schedule);
            }
          });
       }
     });
    return foodtrucks;
}


/** 
 *  Gets the Mongo Foodtruck Collection. 
 */
function getFoodTruckCollection()
{
  return db.collection('foodTrucks');
}

/** 
 * Add the processed list to the store. 
 */
function addFoodTruckstoStore(foodtrucks)
{

   //note: the DB was configured to make the truck name unique. 
   var collection = getFoodTruckCollection();
   collection.ensureIndex({'name': 1}, {unique: true}, function(a,b){});
   collection.insert(foodtrucks,  function(err, result) { 
                                    if (err) { console.log("problem updating db") }
                                    if (result) { }
                                  });
}

//Helper Class to keep track of duplicates
function Hasher()
{
  this.truckHash = {};
}

Hasher.prototype.createHash = function createHash(name, idx, address)
{

  this.truckHash[name] = new Object();
  this.truckHash[name].idx = idx; //add an entry in the hash for this truck name
  this.truckHash[name].locationHash = {};
  this.truckHash[name].locationHash[address] = true;  
}

Hasher.prototype.getHash = function getHash(name)
{
  return this.truckHash[name];
}

Hasher.prototype.getLocation = function getName(name, address)
{
    if (this.getHash(name))
      return this.truckHash[name].locationHash[address];
    return null;
}

Hasher.prototype.getIndex = function getIndex(name)
{
    if (this.getHash(name))
      return this.truckHash[name].idx;
    return null;
}

Hasher.prototype.updateLocation = function updateLocation(name, address)
{
  if (this.getHash(name))
    this.truckHash[name].locationHash[address] = true;
}



//note: The DataSF SODA API was not giving the full list as if when downloading the static JSON.
//this is not being used but just here as an example of calling a WS in Node. 
/*exports.foodTrucksList = function()
{
           var options = {
            host: 'data.sfgov.org',
            path: '/resource/jjew-r69b.json',
            method:'GET'
        };

        return getTrucksListFromHTTP(options);
}
*/
/*
function getTrucksListFromHTTP(options) {

    return function(req, res) {

        var data = '';
        var callback = function(response) 
        {
            response.on('data', function (chunk) {
              data += chunk;
            });

            response.on('end', function () {
            
                var trucks = JSON.parse(data);

                var foodTruckObjs = new Array();
                var i; 
                for (i = 0; i < trucks.length; ++i)
                {
                    var truck = trucks[i];
                     //validate the truck data before putting into model list
                     var isValid = validate(foodTruckObjs, truck);
                     if (isValid)
                     {
                        var addresses = new Array(); addresses.push({truck.location, truck.locationdesc, 
                          truck.latitude, truck.longitude});
                        //name, approved, permit, addresses, description)
                        var foodtruck = models.createFoodTruck(truck.applicant, null, truck.permit, addresses, truck.optionaltext);

                        foodTruckObjs.push(foodtruck);
                     }
                }
                res.json(foodTruckObjs);
            });
            response.on('error', function() { console.log("Error!" + data)});
        }

        var req = http.request(options, callback).end();
    }
}
 */


